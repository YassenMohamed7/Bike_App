const express = require('express');
const { getProducts,
    addProduct,
    getSpecificProduct,
    editProduct,
} = require('../Services/stockServices');

const {uploadImage} = require('../Utils/uploadImage');


const router = express.Router();

router.route('/addProduct').post(uploadImage,addProduct);
router.route('/getAllProducts').get(getProducts);
router.route('/getSpecificProduct/:id').get(getSpecificProduct);
router.route('/edit/:id').put(uploadImage, editProduct);

module.exports = router;