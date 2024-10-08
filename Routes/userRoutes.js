const express = require('express');
const {
    getUsers,
    getSpecificUser,
    getTotal,
    getUserStatus,
    getGender
} = require('../Services/userServices');


const router = express.Router();

router.route('/getUsers/:active').get(getUsers);

// @used in overview to display num of total users
router.route('/totalUsers').get(getTotal);


// @used in overview to display status of users

router.route('/getUserStatus/:period').get(getUserStatus);
router.route('/getGenderOfAllUsers/:period').get(getGender);


router.route('/getSpecificUser/:Customer_Id').get(getSpecificUser);


module.exports = router;
