const express = require('express');
const {reviews} = require("../Services/reviewServices");



const router = express.Router();


router.route('/').get(reviews);


module.exports = router;