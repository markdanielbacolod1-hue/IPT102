const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getRecentShares, shareDocument, getDocuments,
  getNotifications, markRead, dismissNotification,
} = require('../controllers/sharingController');

router.use(authenticate);

router.get('/documents',            getDocuments);
router.get('/recent',               getRecentShares);
router.post('/send',                shareDocument);
router.get('/notifications',        getNotifications);
router.patch('/notifications/:id/read', markRead);
router.delete('/notifications/:id', dismissNotification);

module.exports = router;
