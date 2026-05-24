const db   = require('../config/db');
const path = require('path');
const fs   = require('fs');

// GET /api/documents — list all documents
async function getDocuments(req, res) {
  try {
    const [docs] = await db.query(
      `SELECT d.document_id, d.title, d.status, d.created_at,
              f.file_name, f.file_path,
              u.full_name AS uploaded_by,
              dep.department_name
       FROM documents d
       LEFT JOIN document_files f   ON d.document_id   = f.document_id
       LEFT JOIN users         u   ON d.uploaded_by    = u.user_id
       LEFT JOIN departments   dep ON d.department_id  = dep.department_id
       WHERE d.status != 'Archived'
       ORDER BY d.created_at DESC`
    );
    return res.json({ documents: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/documents/upload — upload a file and save to DB
async function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const title       = req.body.title || req.file.originalname.replace(/\.[^.]+$/, '');
  const uploaded_by = req.user.userId;

  // Get user's department
  const [[user]] = await db.query('SELECT department_id FROM users WHERE user_id = ?', [uploaded_by]);
  const department_id = user?.department_id || null;

  try {
    // Insert into documents table
    const [docResult] = await db.query(
      `INSERT INTO documents (title, uploaded_by, department_id, status)
       VALUES (?, ?, ?, 'Active')`,
      [title, uploaded_by, department_id]
    );

    const document_id = docResult.insertId;
    const fileSize    = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';

    // Insert into document_files table
    await db.query(
      `INSERT INTO document_files (document_id, file_name, file_path)
       VALUES (?, ?, ?)`,
      [document_id, req.file.originalname, req.file.path]
    );

    return res.status(201).json({
      message: 'File uploaded successfully.',
      document: {
        document_id,
        title,
        file_name: req.file.originalname,
        size: fileSize,
        created_at: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// PUT /api/documents/:id/rename — rename a document
async function renameDocument(req, res) {
  const { title } = req.body;
  const { id }    = req.params;

  if (!title) return res.status(400).json({ message: 'Title is required.' });

  try {
    await db.query('UPDATE documents SET title = ? WHERE document_id = ?', [title, id]);
    return res.json({ message: 'Document renamed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// DELETE /api/documents/:id — soft delete (archive)
async function deleteDocument(req, res) {
  try {
    await db.query("UPDATE documents SET status = 'Archived' WHERE document_id = ?", [req.params.id]);
    return res.json({ message: 'Document deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// GET /api/documents/activity — recent document activity
async function getActivity(req, res) {
  try {
    const [logs] = await db.query(
      `SELECT ual.activity, ual.activity_time, u.full_name
       FROM user_activity_logs ual
       JOIN users u ON ual.user_id = u.user_id
       WHERE ual.activity LIKE '%ocument%' OR ual.activity LIKE '%Upload%'
       ORDER BY ual.activity_time DESC
       LIMIT 10`
    );
    return res.json({ activity: logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { getDocuments, uploadDocument, renameDocument, deleteDocument, getActivity };
