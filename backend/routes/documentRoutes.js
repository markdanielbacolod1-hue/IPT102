const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { authenticate } = require('../middleware/auth');
const {
  getDocuments, uploadDocument, renameDocument,
  deleteDocument, getActivity,
} = require('../controllers/documentController');

// Save uploaded files to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Keep original name but prefix with timestamp to avoid conflicts
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.use(authenticate);

router.get('/',           getDocuments);
router.get('/activity',   getActivity);
router.post('/upload',    upload.single('file'), uploadDocument);
router.put('/:id/rename', renameDocument);
router.delete('/:id',     deleteDocument);

module.exports = router;
