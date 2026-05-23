const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'mySecretKey123';

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.full_name, u.email, u.password, u.status,
              r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Your account is inactive.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role_name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    });

    await db.query(
      'INSERT INTO user_activity_logs (user_id, activity) VALUES (?, ?)',
      [user.user_id, 'Login Successful']
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id:       user.user_id,
        fullName: user.full_name,
        email:    user.email,
        role:     user.role_name,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/auth/logout
async function logout(req, res) {
  if (req.user) {
    await db.query(
      'INSERT INTO user_activity_logs (user_id, activity) VALUES (?, ?)',
      [req.user.userId, 'Logged Out']
    );
  }
  res.clearCookie('token');
  return res.json({ message: 'Logged out.' });
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.full_name, u.email, u.status,
              r.role_name, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE u.user_id = ?`,
      [req.user.userId]
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

module.exports = { login, logout, getMe };