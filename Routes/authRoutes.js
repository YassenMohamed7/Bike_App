const express = require('express');
const {
    signup,
    login,
    resetPassword
} = require("../Services/authServices");

const {uploadImage} = require('../Utils/uploadImage')


const router = express.Router();


router.route('/signup').post(uploadImage, signup);
router.route('/login').post(login);
router.route('/resetPassword').get(resetPassword);

module.exports = router;