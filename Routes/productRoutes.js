const express = require('express');
const { getProducts,
    addProduct, 
    getSpecificProduct} = require('../Services/productServices');
// required Services


const router = express.Router();

router.route('/').post(addProduct);
router.route('/').get(getProducts).post(addProduct);
router.route('/:id').get(getSpecificProduct);

module.exports = router;