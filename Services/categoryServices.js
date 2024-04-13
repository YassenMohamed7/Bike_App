const categories = require('../Models/categories');
const asyncHandler = require('express-async-handler');



// add new category
// route: POST api/v1/categories
// access: private

exports.addCategory = asyncHandler(async (req, res) => {
    const provided_data = req.body;
    const data= {
        Category_Id: provided_data.id,
        Category_Name: provided_data.name,
        Description: provided_data.description,
        Image: provided_data.image
    }

    await categories.doc(`${provided_data.id}`).create(data);
    res.redirect('/api/v1/categories');

})

// get all categories
// route: GET api/v1/categories
// access: private

exports.getCategories = asyncHandler(async (req, res) => {
    const snapshot = await categories.get();
    const docs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(docs);
})






