const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user in database
    const [rows] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.password, u.status, u.department_id, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = ?`,
      [email.toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Your account is inactive. Contact admin.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Save token in httpOnly cookie (more secure than localStorage)
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    // Log the login activity
    await pool.query(
      'INSERT INTO user_activity_logs (user_id, activity, department_id, status) VALUES (?, ?, ?, ?)',
      [user.user_id, 'Login Successful', user.department_id, 'Active']
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        userId:   user.user_id,
        fullName: user.full_name,
        email:    user.email,
        role:     user.role_name,
      },
      token, // also return token for clients that prefer headers
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    if (req.user) {
      await pool.query(
        'INSERT INTO user_activity_logs (user_id, activity, status) VALUES (?, ?, ?)',
        [req.user.user_id, 'Logged Out', 'Active']
      );
    }

    res.clearCookie('accessToken');
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// GET /api/auth/me — get current logged-in user info
const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.status, u.created_at,
              r.role_name, d.department_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE u.user_id = ?`,
      [req.user.user_id]
    );

    return res.status(200).json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

module.exports = { login, logout, getMe };
EOF