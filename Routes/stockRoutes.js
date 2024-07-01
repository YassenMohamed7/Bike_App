const express = require('express');
const { getProducts,
    addProduct,
    getSpecificProduct,
    editProduct,
    deleteProduct
} = require('../Services/stockServices');

const {uploadImage} = require('../Utils/uploadImage');


const router = express.Router();

router.route('/addProduct').post(uploadImage,addProduct);
router.route('/getProducts/:page').get(getProducts);
router.route('/getSpecificProduct/:id').get(getSpecificProduct);
router.route('/editProduct').put(uploadImage, editProduct);
router.route('/deleteProduct/:id').delete(deleteProduct);

module.exports = router;