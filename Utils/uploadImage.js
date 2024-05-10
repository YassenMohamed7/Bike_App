const multer = require('multer');


// @desc configuring multer for uploading single image
const multerStorage = multer.memoryStorage({
    destination: function (req, file, cb) {
        // no local storage, upload directly to Firebase bucket.
        cb(null, '');
    },
    filename: function (req, file, cb) {
        // mimetype is file_type/extension
        const ext = file.mimetype.split('/')[1];
        const filename = `${Date.now()}.${ext}`;
        cb(null, filename);
    },
});
const multerFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[0];
    if(type === 'image'){
        cb(null, true);
    }else{
        cb(new apiError("Only images are allowed", 400), false);
    }
}
const upload = multer({storage: multerStorage,
    fileFilter: multerFilter});

exports.uploadImage = upload.single('Image');