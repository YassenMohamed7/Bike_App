const express = require("express");

const {addPayment, getAllPayments} = require("../Services/paymentServices");


const router = express.Router();

router.route('/getAllPayments').get(getAllPayments);
router.route('/addPayment').post(addPayment);

module.exports = router;