const bcrypt = require('bcryptjs');
const db     = require('../config/db');

// GET /api/users — list all users (Admin only)
async function getAllUsers(req, res) {
  try {
    const [users] = await db.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, u.created_at,
              r.role_name, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       ORDER BY u.created_at DESC`
    );

    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/users/:id — get one user
async function getUserById(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, u.created_at,
              r.role_id, r.role_name, d.department_id, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE u.user_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/users — create user (Admin only)
async function createUser(req, res) {
  const { full_name, email, password, role_id, department_id } = req.body;

  if (!full_name || !email || !password || !role_id) {
    return res.status(400).json({ message: 'full_name, email, password, and role_id are required.' });
  }

  try {
    // Check if email already used
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, role_id, department_id) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashed, role_id, department_id || null]
    );

    return res.status(201).json({ message: 'User created.', userId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// PUT /api/users/:id — update user (Admin, or own profile)
async function updateUser(req, res) {
  const { full_name, email, role_id, department_id, status } = req.body;
  const { id } = req.params;

  const isAdmin = req.user.role === 'Admin';
  const isSelf  = req.user.userId === parseInt(id);

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'You can only update your own profile.' });
  }

  try {
    // Non-admins cannot change role or status
    const [current] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await db.query(
      `UPDATE users SET
        full_name     = ?,
        email         = ?,
        role_id       = ?,
        department_id = ?,
        status        = ?
       WHERE user_id = ?`,
      [
        full_name     || current[0].full_name,
        email         || current[0].email,
        isAdmin ? (role_id       || current[0].role_id)       : current[0].role_id,
        isAdmin ? (department_id || current[0].department_id) : current[0].department_id,
        isAdmin ? (status        || current[0].status)        : current[0].status,
        id,
      ]
    );

    return res.json({ message: 'User updated.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// PATCH /api/users/:id/password — change password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  const isAdmin = req.user.role === 'Admin';
  const isSelf  = req.user.userId === parseInt(id);

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If not admin, verify the current password first
    if (!isAdmin) {
      const match = await bcrypt.compare(currentPassword, rows[0].password);
      if (!match) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashed, id]);

    return res.json({ message: 'Password updated.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// DELETE /api/users/:id — soft delete (Admin only)
async function deleteUser(req, res) {
  const { id } = req.params;

  if (req.user.userId === parseInt(id)) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  try {
    await db.query("UPDATE users SET status = 'Inactive' WHERE user_id = ?", [id]);
    return res.json({ message: 'User deactivated.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/roles — list all roles
async function getRoles(req, res) {
  const [roles] = await db.query('SELECT role_id, role_name FROM roles');
  return res.json({ roles });
}

// GET /api/departments — list all departments
async function getDepartments(req, res) {
  const [departments] = await db.query('SELECT department_id, department_name FROM departments');
  return res.json({ departments });
}

// GET /api/users/:id/activity — get user activity logs
async function getUserActivity(req, res) {
  const { id } = req.params;
  const isAdmin = req.user.role === 'Admin';
  const isSelf  = req.user.userId === parseInt(id);

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    const [logs] = await db.query(
      `SELECT log_id, activity, activity_time
       FROM user_activity_logs
       WHERE user_id = ?
       ORDER BY activity_time DESC
       LIMIT 20`,
      [id]
    );
    return res.json({ logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, deleteUser, getRoles, getDepartments, 
  getUserActivity,
};