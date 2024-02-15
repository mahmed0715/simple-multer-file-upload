const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'))
// Multer upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // File retains its original name
  }
});
const upload = multer({ storage: storage });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Express route for file upload
app.post('/upload2', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send('File Upload Successful');
  } else {
    res.send('File Upload Failed');
  }
});

// Start server
app.listen(3002, () => {
  console.log('Server running on port 3000');
});
