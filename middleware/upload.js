const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'temp' folder exists
const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // store in temp folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
