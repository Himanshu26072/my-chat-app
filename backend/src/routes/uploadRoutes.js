const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// 1. Configure Cloudinary with your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Cloudinary Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chatbox_uploads', 
    resource_type: 'auto',     
  },
});

const upload = multer({ storage });

// 3. The Upload Route with Advanced Error Catching
// @route   POST /api/upload
router.post('/', protect, (req, res) => {
  // We wrap the upload function so we can catch the exact error
  upload.single('file')(req, res, function (error) {
    
    // If Cloudinary rejects the file, print the exact reason to the terminal
    if (error) {
      console.error("🔥 CLOUDINARY UPLOAD ERROR:", error); 
      return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
    }

    // If no file was sent from the frontend
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Success! Return the new Cloudinary web URL
    res.status(200).json({
      fileUrl: req.file.path, 
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });
  });
});

module.exports = router;