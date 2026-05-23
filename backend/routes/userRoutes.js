const express = require('express');
const router  = express.Router();

const {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, toggleUserStatus, deleteUser,
  getUserActivity, getRoles, getDepartments,
} = require('../controllers/userController');

const { authenticate, authorize } = require('../middleware/auth');
const { createUserRules, updateUserRules, changePasswordRules } = require('../middleware/validators');

// All routes below require a valid session
router.use(authenticate);

// ── Reference Data ────────────────────────────────────────────────────────────
// GET /api/users/roles       — All authenticated users can read roles
router.get('/roles',       getRoles);
// GET /api/users/departments — All authenticated users can read departments
router.get('/departments', getDepartments);

// ── User CRUD ─────────────────────────────────────────────────────────────────

// GET  /api/users            — Admin only: list all users (with filters + pagination)
router.get(
  '/',
  authorize('Admin'),
  getAllUsers
);

// POST /api/users            — Admin only: create a new user
router.post(
  '/',
  authorize('Admin'),
  createUserRules,
  createUser
);

// GET  /api/users/:id        — Admin or own profile
router.get('/:id', getUserById);

// PUT  /api/users/:id        — Admin (any field) or self (name/email only)
router.put('/:id', updateUserRules, updateUser);

// PATCH /api/users/:id/password — Admin (no current pw needed) or self
router.patch('/:id/password', changePasswordRules, changePassword);

// PATCH /api/users/:id/status   — Admin only: toggle Active/Inactive
router.patch(
  '/:id/status',
  authorize('Admin'),
  toggleUserStatus
);

// DELETE /api/users/:id     — Admin only (soft-delete → Inactive)
router.delete(
  '/:id',
  authorize('Admin'),
  deleteUser
);

// GET /api/users/:id/activity — Admin or own activity
router.get('/:id/activity', getUserActivity);

module.exports = router;
