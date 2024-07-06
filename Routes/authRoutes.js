const express = require('express');
const {
    signup,
} = require("../Services/authServices");

const {uploadImage} = require('../Utils/uploadImage')


const router = express.Router();


router.route('/signup').post(uploadImage, signup);

module.exports = router;