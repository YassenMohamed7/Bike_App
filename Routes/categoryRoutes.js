const express = require('express');
const {
    uploadCategoryImage,
    addCategory,
    getCategories} = require("../Services/categoryServices");

const {uploadImage} = require('../Utils/uploadImage')


const router = express.Router();


router.route('/getCategories').get(getCategories);

router.route('/addCategory').post(uploadImage, addCategory);

module.exports = router;