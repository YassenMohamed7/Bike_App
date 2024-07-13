const express = require('express');
const {
    addEmployee,
    getEmployees
} = require("../Services/employeeServices");

const {uploadImage} = require('../Utils/uploadImage')


const router = express.Router();

router.route('/getEmployees/:page').get(getEmployees);

module.exports = router;