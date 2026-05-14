/**
 * File Upload Middleware using Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config/constants');

class UploadMiddleware {
  constructor() {
    // Ensure upload directory exists
    const uploadPath = path.resolve(UPLOAD_DIR);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Configure storage
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
      },
    });

    // File filter
    const fileFilter = (req, file, cb) => {
      if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Only image uploads are allowed'), false);
      }
      cb(null, true);
    };

    // Create multer instance
    this.upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });
  }

  /**
   * Upload single image
   */
  single(fieldName = 'image') {
    return this.upload.single(fieldName);
  }

  /**
   * Upload multiple images
   */
  multiple(fieldName = 'images', maxCount = 5) {
    return this.upload.array(fieldName, maxCount);
  }
}

module.exports = new UploadMiddleware();
