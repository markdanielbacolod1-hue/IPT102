// Add these to your backend index.js (or a new dashboardRoutes.js)
// This shows how to add the /api/dashboard and /api/users/:id/activity endpoints

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/dashboard — summary stats for the dashboard cards and charts
router.get('/', async (req, res) => {
  try {
    const [[userStats]] = await db.query(`
      SELECT
        COUNT(*)                                      AS totalUsers,
        SUM(status = 'Active')                        AS activeUsers,
        SUM(status = 'Inactive')                      AS inactiveUsers
      FROM users
    `);

    const [[docStats]] = await db.query(`
      SELECT COUNT(*) AS totalDocuments FROM documents
    `);

    const [[shareStats]] = await db.query(`
      SELECT COUNT(*) AS sharedDocuments FROM document_shares
    `);

    const [[qrStats]] = await db.query(`
      SELECT COUNT(*) AS qrScans FROM document_tracking
    `);

    // Documents uploaded per month (last 6 months)
    const [uploadsPerMonth] = await db.query(`
      SELECT
        DATE_FORMAT(created_at, '%b') AS month,
        COUNT(*) AS count
      FROM documents
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY MONTH(created_at)
    `);

    // Documents per department
    const [documentsByDept] = await db.query(`
      SELECT d.department_name AS department, COUNT(doc.document_id) AS count
      FROM departments d
      LEFT JOIN documents doc ON doc.department_id = d.department_id
      GROUP BY d.department_id, d.department_name
    `);

    return res.json({
      stats: {
        ...userStats,
        ...docStats,
        ...shareStats,
        ...qrStats,
      },
      uploadsPerMonth,
      documentsByDept,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
