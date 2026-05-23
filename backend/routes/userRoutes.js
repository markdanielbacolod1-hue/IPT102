const express = require('express');
const router  = express.Router();

const {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, deleteUser, getRoles, getDepartments,
} = require('../controllers/userController');

const { authenticate, authorize } = require('../middleware/auth');

// All routes need a valid login
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