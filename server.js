// const express = require('express');
// const multer  = require('multer');
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// // Set up multer disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Uploads folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// })

// const upload = multer({ storage: storage });

// // Simple file upload route
// app.post('/upload', upload.any(), (req, res, next) => {
//     console.log('uploading....')
//   const file = req.file;
//   if (!file) {
//     const error = new Error('Please upload a file');
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   res.send(file);  // You can send a JSON response or any other response here
// })

// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception:', err);
//     process.exit(1); // Exit with failure code
//   });
// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

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
// Set the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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
}).any();

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
    cb('Error: Images Only!');
  }
}

app.use((req, res, next)=>{
console.log("req", req.url, req.method)
next();
})
// Simple file upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err); // Log the error
      res.status(400).json({ error: err });
    } else {
        console.log("files", req.files, req.file)
      if (req.files === undefined) {
        res.status(400).json({ error: 'Error: No File Selected!' });
      } else {
        console.log(req.files); // Log the uploaded file
        res.status(200).json({ message: 'File Uploaded Successfully!', file: req.files });
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

