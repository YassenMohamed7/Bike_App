const express = require('express');
const { getProducts,
    addProduct, 
    getSpecificProduct,
    editProduct,
    uploadProductImage
} = require('../Services/productServices');



const router = express.Router();

router.route('/addProduct').post(uploadProductImage,addProduct);
router.route('/getAllProducts').get(getProducts);
router.route('/getSpecificProduct/:id').get(getSpecificProduct);
router.route('/edit/:id').put(editProduct);

module.exports = router;