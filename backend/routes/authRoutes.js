const express = require('express');
const router  = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login',  login);
router.post('/logout', authenticate, logout);
router.get('/me',      authenticate, getMe);

module.exports = router;
EOF

cat > /home/claude/backend/routes/userRoutes.js << 'EOF'
const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, deleteUser, getRoles, getDepartments,
} = require('../controllers/userController');

// All routes require login
router.use(authenticate);

router.get('/roles',       getRoles);
router.get('/departments', getDepartments);

router.get('/',    authorize('Admin'), getAllUsers);
router.post('/',   authorize('Admin'), createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/password', changePassword);
router.delete('/:id', authorize('Admin'), deleteUser);

module.exports = router;