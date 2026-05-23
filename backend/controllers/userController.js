const bcrypt = require('bcryptjs');
const pool   = require('../config/db');

// GET /api/users — list all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, u.created_at,
              r.role_name, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id 
       ORDER BY u.created_at DESC`
    );

    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// GET /api/users/:id — get one user
const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, u.created_at,
              r.role_id, r.role_name, d.department_id, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE u.user_id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// POST /api/users — create a new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, role_id, department_id, status = 'Active' } = req.body;

    if (!full_name || !email || !password || !role_id) {
      return res.status(400).json({ success: false, message: 'full_name, email, password, and role_id are required.' });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, role_id, department_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email.toLowerCase(), hashedPassword, role_id, department_id || null, status]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// PUT /api/users/:id — update user info
const updateUser = async (req, res) => {
  try {
    const { full_name, email, role_id, department_id, status } = req.body;
    const { id } = req.params;
    const isAdmin = req.user.role_name === 'Admin';
    const isSelf  = parseInt(id) === req.user.user_id;

    // Non-admins can only edit their own profile
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: 'You can only edit your own profile.' });
    }

    // Get current data
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const current = rows[0];

    await pool.query(
      `UPDATE users SET
        full_name     = ?,
        email         = ?,
        role_id       = ?,
        department_id = ?,
        status        = ?
       WHERE user_id = ?`,
      [
        full_name     || current.full_name,
        email         ? email.toLowerCase() : current.email,
        isAdmin ? (role_id || current.role_id) : current.role_id,         // only admin can change role
        isAdmin ? (department_id || current.department_id) : current.department_id,
        isAdmin ? (status || current.status) : current.status,            // only admin can change status
        id,
      ]
    );

    return res.status(200).json({ success: true, message: 'User updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// PATCH /api/users/:id/password — change password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const isAdmin = req.user.role_name === 'Admin';
    const isSelf  = parseInt(id) === req.user.user_id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: 'You can only change your own password.' });
    }

    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required.' });
    }

    const [rows] = await pool.query('SELECT password FROM users WHERE user_id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Non-admin users must verify their current password first
    if (!isAdmin) {
      const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashed, id]);

    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// DELETE /api/users/:id — deactivate user (soft delete, Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const [rows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Soft delete — just mark as Inactive so history is preserved
    await pool.query("UPDATE users SET status = 'Inactive' WHERE user_id = ?", [id]);

    return res.status(200).json({ success: true, message: 'User deactivated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// GET /api/roles
const getRoles = async (req, res) => {
  const [roles] = await pool.query('SELECT role_id, role_name FROM roles');
  return res.status(200).json({ success: true, data: roles });
};

// GET /api/departments
const getDepartments = async (req, res) => {
  const [depts] = await pool.query('SELECT department_id, department_name FROM departments');
  return res.status(200).json({ success: true, data: depts });
};

module.exports = {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, deleteUser, getRoles, getDepartments,
};