const express = require('express');
const router = express.Router();
const {
  getMessages, createMessage, updateMessage, deleteMessage, clearMessages
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

// NEW: Clear route must be above the /:id route
router.route('/clear').delete(protect, clearMessages);

router.route('/').get(protect, getMessages).post(protect, createMessage);
router.route('/:id').put(protect, updateMessage).delete(protect, deleteMessage);

module.exports = router;