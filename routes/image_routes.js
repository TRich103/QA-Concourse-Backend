//Code for uploading a profile picture
var express =require('express');
var Image =require('../models/image');
var ImageRouter =express.Router();
var aws = require('aws-sdk');
var accessKey = process.env.AWS_ACCESS_KEY;
var secretAccess = process.env.AWS_SECRET_KEY;
var s3bucket = process.env.S3_BUCKET;
const multer =require('multer');
const multerS3 =require('multer-s3');


var s3 = new aws.S3();

aws.config.update({
    secretAccessKey: secretAccess,
    accessKeyId: accessKey,
    region: 'eu-west-2'
});

s3.config.update({
    secretAccessKey: secretAccess,
    accessKeyId: accessKey,
    region: 'eu-west-2'
});

//fileFilter variable defines the file types
//which are to be accepted by the server
const fileFilter =(req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else{
    //rejects storing a file
    cb(null, false);
    }
}

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: s3bucket,
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
          },
          key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString())
          }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


/*const storage =multerS3({
    s3: s3,
    bucket: 'process.env.S3_BUCKET',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  });
/*

storage variable is where the
path to the destination folder being used
and the filename for the file uploaded is defined
*/
/*const storage =multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
        //cb(null, 'C:/Users/spiro/QABursaryProject/QA-Concourse-Backend/uploads');
    },
    filename: function(req, file, cb){
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, file.originalname + ext);
    }
});


The upload variable creates an instance of the multer 
middleware with the storage details, maximum acceptable file size 
and filter options being set

*/
/*const upload = multer({

    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/*
    stores image in uploads folder
    using multer and creates a reference
    to the file
*/

/*

The route /uploadmulter is created where
the incoming multipart data which consists
of the image file being sent from the front
end is processed. The upload.single() function
should be provided with the key-name consisting of
the image file to invoke multer properly. Then 
the data is sent to the MongoDB database
*/
ImageRouter.route("/uploadmulter")
    .post(upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.file.path
        });

        newImage.save()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                success: true,
                document: result
            });
        })
    .catch((err) => next(err));
    });
    module.exports = ImageRouter;
