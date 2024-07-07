const express = require('express');
const {
    signup,
    login,
} = require("../Services/authServices");

const {uploadImage} = require('../Utils/uploadImage')


const router = express.Router();


router.route('/signup').post(uploadImage, signup);
router.route('/login').get(login);

module.exports = router;