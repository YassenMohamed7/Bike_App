const express = require('express');
const {getOrders} = require("../Services/orderServices");



const router = express.Router();


router.route('/getOrders').get(getOrders);


module.exports = router;