const express = require('express');
const {
    addCategory,
    getCategories} = require("../Services/categoryServices");

const router = express.Router();




router.route('/').get(getCategories);
router.route('/').post(addCategory);


module.exports = router;