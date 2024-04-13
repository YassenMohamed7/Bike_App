const express = require('express');
const { getProducts,
    addProduct, 
    getSpecificProduct, editProduct
} = require('../Services/productServices');
// required Services


const router = express.Router();

router.route('/addProduct').post(addProduct);
router.route('/getAllProducts').get(getProducts);
router.route('/getSpecificProduct/:id').get(getSpecificProduct);
router.route('/edit/:id').put(editProduct);

module.exports = router;