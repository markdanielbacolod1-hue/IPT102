const { body } = require('express-validator');

// ─── Auth ─────────────────────────────────────────────────────────────────────
const loginRules = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

// ─── Create User ──────────────────────────────────────────────────────────────
const createUserRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
  body('role_id')
    .isInt({ min: 1 }).withMessage('Valid role_id is required.'),
  body('department_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('department_id must be a positive integer.'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive.'),
];

// ─── Update User ──────────────────────────────────────────────────────────────
const updateUserRules = [
  body('full_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Full name cannot be empty.')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('role_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Valid role_id is required.'),
  body('department_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('department_id must be a positive integer.'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive.'),
];

// ─── Change Password ──────────────────────────────────────────────────────────
const changePasswordRules = [
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

module.exports = { loginRules, createUserRules, updateUserRules, changePasswordRules };
