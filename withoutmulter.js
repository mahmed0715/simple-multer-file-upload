const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;

// Enable file upload middleware
app.use(fileUpload());

// the HTML form for file upload
app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});

// Handle the file upload
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const uploadDir = './uploads';

  file.mv(`${uploadDir}/${file.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json(file);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
