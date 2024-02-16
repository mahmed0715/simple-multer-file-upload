const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'))
// Multer upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Express route for file upload
app.post('/upload2', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send('File Upload Successful');
  } else {
    res.send(req.file);
  }
});

// Start server
app.listen(3002, () => {
  console.log('Server running on port 3000');
});
