const express = require('express');
const {getOrders,
    getTotalOrders} = require("../Services/orderServices");



const router = express.Router();


router.route('/getOrders').get(getOrders);
router.route('/getTotalOrders').get(getTotalOrders);


module.exports = router;