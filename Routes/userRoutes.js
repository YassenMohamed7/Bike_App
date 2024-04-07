const express = require('express');
const {getUsers} = require('../Services/userServices');
// required Services


const router = express.Router();

router.route('/').get(getUsers);
router.route('/:Customer_Id').get(getSpecificUsers);


module.exports = router;
