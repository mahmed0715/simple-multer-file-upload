var multer = require('multer'); 
var upload = multer({ dest:'uploads/' });

router.post('/bars/upload', upload.single('someFile') ,function (req, res, next) {

    // if you're here, the file should have already been uploaded

    console.log(req.files); 
    console.log(req.body);// {"someParam": "someValue"}
    res.send(req.files); 
});