const express = require('express');
const {
    getUsers,
    getSpecificUser,
    getTotal,
    getUserStatus
} = require('../Services/userServices');


const router = express.Router();

router.route('/').get(getUsers);


// @used in overview to display num of total users
router.route('/totalUsers').get(getTotal);


// @used in overview to display status of users

router.route('/getUserStatus').get(getUserStatus);



router.route('/getSpecificUser/:Customer_Id').get(getSpecificUser);


module.exports = router;
