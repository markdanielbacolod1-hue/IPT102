const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '231869',
  database: process.env.DB_NAME     || 'document_tracking_system',
});

module.exports = db;
