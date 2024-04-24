const express = require('express');
const {
    uploadCategoryImage,
    addCategory,
    getCategories} = require("../Services/categoryServices");


const router = express.Router();




router.route('/getCategories').get(getCategories);


router.post('/addCategory', uploadCategoryImage, addCategory);

module.exports = router;