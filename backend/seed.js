require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./config/db');

async function seed() {
  console.log('Seeding database...\n');

  // Roles
  const roles = ['Admin', 'Staff', 'Department Head'];
  for (const name of roles) {
    await pool.query('INSERT IGNORE INTO roles (role_name) VALUES (?)', [name]);
  }
  console.log('✅ Roles done');

  // Departments
  const departments = ['HR', 'Registrar', 'Finance', 'Admin'];
  for (const name of departments) {
    await pool.query('INSERT IGNORE INTO departments (department_name) VALUES (?)', [name]);
  }
  console.log('✅ Departments done');

  // Document Categories
  const categories = ['Transcript Of Records', 'COR', 'Form 137', 'Form 138', 'Good Moral', 'Grading Sheet', 'Diploma'];
  for (const name of categories) {
    await pool.query('INSERT IGNORE INTO document_categories (category_name) VALUES (?)', [name]);
  }
  console.log('✅ Document categories done');

  // Default admin user
  const [[existingAdmin]] = await pool.query('SELECT user_id FROM users WHERE email = ?', ['admin@doctrack.local']);
  if (!existingAdmin) {
    const [[adminRole]] = await pool.query("SELECT role_id FROM roles WHERE role_name = 'Admin'");
    const [[adminDept]] = await pool.query("SELECT department_id FROM departments WHERE department_name = 'Admin'");
    const hashed = await bcrypt.hash('Admin@1234', 12);
    await pool.query(
      'INSERT INTO users (full_name, email, password, role_id, department_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['System Admin', 'admin@doctrack.local', hashed, adminRole.role_id, adminDept.department_id, 'Active']
    );
    console.log('\n✅ Admin user created');
    console.log('   Email:    admin@doctrack.local');
    console.log('   Password: Admin@1234');
    console.log('   ⚠️  Change the password after first login!\n');
  } else {
    console.log('ℹ️  Admin already exists, skipped');
  }

  console.log('\nDone! You can now start the server.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});