const bcrypt = require('bcryptjs');
const db     = require('./config/db');

async function seed() {
  const roles = ['Admin', 'Staff', 'Department Head'];
  for (const name of roles) {
    await db.query('INSERT IGNORE INTO roles (role_name) VALUES (?)', [name]);
  }

  const departments = ['HR', 'Registrar', 'Finance', 'Admin'];
  for (const name of departments) {
    await db.query('INSERT IGNORE INTO departments (department_name) VALUES (?)', [name]);
  }

  const [[existing]] = await db.query("SELECT user_id FROM users WHERE email = 'admin@admin.com'");

  if (!existing) {
    const [[role]] = await db.query("SELECT role_id FROM roles WHERE role_name = 'Admin'");
    const [[dept]] = await db.query("SELECT department_id FROM departments WHERE department_name = 'Admin'");
    const password = await bcrypt.hash('admin123', 10);

    await db.query(
      'INSERT INTO users (full_name, email, password, role_id, department_id) VALUES (?, ?, ?, ?, ?)',
      ['System Admin', 'admin@admin.com', password, role.role_id, dept.department_id]
    );

    console.log('Admin user created:');
    console.log('  Email:    admin@admin.com');
    console.log('  Password: admin123');
  } else {
    console.log('Admin already exists, skipped.');
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
