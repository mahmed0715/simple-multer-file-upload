const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'))
// Multer upload configuration
// const upload = multer({ storage: storage });

// Body parser middleware
app.use(bodyParser.json({limit: '500mb'})); // parse application/json 
app.use(bodyParser.json({type: 'application/vnd.api+json', extended: true, limit: '500mb' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true, limit: '500mb'})); // parse application/x-www-form-urlencoded

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({ destination: 'uploads/' }); // Provide the destination directory for uploaded files
const upload2 = multer({ storage: storage }).single('file'); // Use single() to indicate that this endpoint only expects a single file with the name 'file'
app.post('/upload2', (req, res) => {
  console.log(req.body);
  upload2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred.
      res.status(500).json({ error: err.message });
    } else {
      // Everything went fine. Access the file through req.file and other form fields through req.body
      console.log(req.file); // File information
      console.log(req.body.name); // Other form field
      res.send('File Upload Successful');
    }
  });
});

// Express route for file upload
app.post('/upload2', (req, res) => {
  console.log(req.body);
  if (req.file) {
    res.send('File Upload Successful');
  } else {
    res.send(req.file);
  }
});

// Start server
app.listen(3002, () => {
  console.log('Server running on port 3002');
});
