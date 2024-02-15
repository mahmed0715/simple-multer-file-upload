const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Set up multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

// Simple file upload route
app.post('/upload', upload.any(), (req, res, next) => {
    console.log('uploading....')
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);  // You can send a JSON response or any other response here
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with failure code
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
