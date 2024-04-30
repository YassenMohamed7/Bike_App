const categories = require('../Models/categories');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const apiError = require('../Utils/apiError');
const {bucket} = require("../Config/connection");

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

exports.uploadCategoryImage = upload.single('image');


// add new category
// route: POST api/v1/categories/addCategory
// access: private

exports.addCategory = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;
    // generate image name
    const ext = file.mimetype.split('/')[1];
    const imageName = `category/${Date.now()}.${ext}`;
    const imageFile = bucket.file(imageName);
    const fileStream = imageFile.createWriteStream();
    fileStream.on('error', () => {
        next(new apiError("Error uploading image", 500));
    });

    fileStream.on('finish', async ()=>{
            const imageUrl = await imageFile.getSignedUrl({
                action: 'read',
                expires: '1-1-2030'
            });
        const data= {
            Category_Id: provided_data.id,
            Category_Name: provided_data.name,
            Description: provided_data.description,
            Image: imageUrl[0]
        }
        await categories.doc(`${provided_data.id}`).create(data);
    });
    fileStream.end(file.buffer);


    res.redirect('/api/v1/categories/getCategories');

})

// get all categories
// route: GET api/v1/categories/getCategories
// access: private

exports.getCategories = asyncHandler(async (req, res) => {
    const snapshot = await categories.get();
    const docs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(docs);
})






