const categories = require('../Models/categories');
const asyncHandler = require('express-async-handler');
const apiError = require('../Utils/apiError');
const uploadImage = require('../Utils/uploadImageToBucket');


// add new category
// route: POST api/v1/categories/addCategory
// access: private

exports.addCategory = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;
    const data= {
        Category_Id: provided_data.id,
        Category_Name: provided_data.name,
        Description: provided_data.description,
        Image: null
    }


    uploadImage(file, async (err, _imageUrl) => {
        if (err) {
            next(new apiError("Error Uploading Image", 500));
        } else {
            console.log("Image is: ", _imageUrl);
            data.Image = _imageUrl;
            await categories.doc(`${provided_data.id}`).create(data);
        }
    });

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






