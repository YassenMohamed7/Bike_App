const express = require('express');
const {getUsers, getSpecificUser} = require('../Services/userServices');
// required Services


const router = express.Router();

router.route('/').get(getUsers);
router.route('/getSpecificUser/:Customer_Id').get(getSpecificUser);


module.exports = router;
