const express = require('express');
const {
    uploadCategoryImage,
    addCategory,
    getCategories} = require("../Services/categoryServices");


const router = express.Router();


router.route('/getCategories').get(getCategories);


router.route('/addCategory').post(uploadCategoryImage, addCategory);

module.exports = router;