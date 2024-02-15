const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan'); // For HTTP request logging
const app = express();
const port = 3000;

// Create a write stream (in append mode) for logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

const pathU = './uploads';

// Check if the directory exists
if (!fs.existsSync(pathU)) {
  // If it doesn't exist, create it
  fs.mkdir(pathU, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating upload directory:', err);
    } else {
      // Set permissions for the directory
      fs.chmod(pathU, 0o755, (err) => {
        if (err) {
          console.error('Error setting permissions for upload directory:', err);
        } else {
          console.log('Upload directory created with permissions set successfully');
        }
      });
    }
  });
}

// Set the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size if required
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('file', 10); // Modify the multer initialization

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only!'); // Add return statement here
  }
}

app.use((req, res, next) => {
  console.log("req", req.url, req.method)
  next();
});

// Simple file upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err); // Log the error
      res.status(400).json({ error: err });
    } else {
      console.log("files", req.files); // Log the uploaded files (note: req.files, not req.file)
      if (req.files.length === 0) { // Correct condition for if no file was selected
        res.status(400).json({ error: 'Error: No File Selected!' });
      } else {
        console.log(req.files); // Log the uploaded files
        res.status(200).json({ message: 'Files Uploaded Successfully!', files: req.files });
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
