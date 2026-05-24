const db = require('../config/db');

// GET /api/sharing/recent — recent shares
async function getRecentShares(req, res) {
  try {
    const [shares] = await db.query(
      `SELECT ds.share_id, d.title AS doc, u.full_name AS sender,
              dep.department_name AS recipient_dept, ds.shared_at
       FROM document_shares ds
       JOIN documents    d   ON ds.document_id        = d.document_id
       JOIN users        u   ON ds.sender_id           = u.user_id
       JOIN departments  dep ON ds.receiver_department = dep.department_id
       ORDER BY ds.shared_at DESC
       LIMIT 20`
    );
    return res.json({ shares });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/sharing/send — share a document
async function shareDocument(req, res) {
  const { document_id, receiver_department } = req.body;
  const sender_id = req.user.userId;

  if (!document_id || !receiver_department) {
    return res.status(400).json({ message: 'document_id and receiver_department are required.' });
  }

  try {
    await db.query(
      `INSERT INTO document_shares (document_id, sender_id, receiver_department)
       VALUES (?, ?, ?)`,
      [document_id, sender_id, receiver_department]
    );

    // Create a notification for the department
    const [deptUsers] = await db.query(
      'SELECT user_id FROM users WHERE department_id = ? AND status = "Active"',
      [receiver_department]
    );

    const [[doc]] = await db.query('SELECT title FROM documents WHERE document_id = ?', [document_id]);

    for (const u of deptUsers) {
      await db.query(
        `INSERT INTO notifications (user_id, document_id, message, notification_type)
         VALUES (?, ?, ?, 'System')`,
        [u.user_id, document_id, `"${doc?.title}" was shared with your department.`]
      );
    }

    return res.json({ message: 'Document shared successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/sharing/documents — list all documents (for the dropdown)
async function getDocuments(req, res) {
  try {
    const [docs] = await db.query(
      `SELECT document_id, title FROM documents WHERE status = 'Active' ORDER BY title`
    );
    return res.json({ documents: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/sharing/notifications — notifications for logged-in user
async function getNotifications(req, res) {
  try {
    const [notifs] = await db.query(
      `SELECT notification_id, message, notification_type, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [req.user.userId]
    );
    return res.json({ notifications: notifs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// PATCH /api/sharing/notifications/:id/read
async function markRead(req, res) {
  try {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    return res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// DELETE /api/sharing/notifications/:id
async function dismissNotification(req, res) {
  try {
    await db.query(
      'DELETE FROM notifications WHERE notification_id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    return res.json({ message: 'Dismissed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { getRecentShares, shareDocument, getDocuments, getNotifications, markRead, dismissNotification };
