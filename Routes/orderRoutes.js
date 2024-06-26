const express = require('express');
const {getOrders,
    getTotalOrders,
    getProductType,
    mostPreferredRental
} = require("../Services/orderServices");



const router = express.Router();


router.route('/getOrders').get(getOrders);
router.route('/getTotalOrders').get(getTotalOrders);
router.route('/getProductType').get(getProductType);
router.route('/mostPreferredRental').get(mostPreferredRental);


module.exports = router;