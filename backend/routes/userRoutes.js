const express = require('express');
const router  = express.Router();
const {
  getAllUsers, getUserById, createUser, updateUser,
  changePassword, deleteUser, getRoles, getDepartments, getUserActivity,
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/roles',       getRoles);
router.get('/departments', getDepartments);

router.get('/',    authorize('Admin'), getAllUsers);
router.post('/',   authorize('Admin'), createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/password', changePassword);
router.delete('/:id', authorize('Admin'), deleteUser);
router.get('/:id/activity', getUserActivity);

module.exports = router;