//Code for uploading a profile picture
var express =require('express');
var Image =require('../models/image');
var ImageRouter =express.Router();
const multer =require('multer');

/*

storage variable is where the
path to the destination folder being used
and the filename for the file uploaded is defined
*/
const storage =multer.diskStorage({
    destination: function(req, file, cb){
        //cb(null, './uploads/');
        cb(null, 'C:/Users/spiro/QABursaryProject/QA-Concourse-Backend/uploads');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

/*

fileFilter variable defines the file types
which are to be accepted by the server

*/
const fileFilter =(req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else{
    //rejects storing a file
    cb(null, false);
    }
}

/*

The upload variable creates an instance of the multer 
middleware with the storage details, maximum acceptable file size 
and filter options being set

*/
const upload = multer({

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
