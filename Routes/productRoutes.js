const express = require('express');
const { getProducts,
    addProduct, 
    getSpecificProduct,
    editProduct,
    deleteProduct,
    getStatus,
    getTotalNumber
} = require('../Services/productServices');

const {uploadImage} = require('../Utils/uploadImage');



const router = express.Router();

router.route('/addProduct').post(uploadImage,addProduct);
router.route('/getProducts/:page/:category/:type').get(getProducts); // it has two filters 'category' & 'type' will be passed as req body or query parameters
router.route('/getSpecificProduct/:id').get(getSpecificProduct);
router.route('/edit/:id').put(uploadImage, editProduct);
router.route('/delete').delete(deleteProduct); // passing the product id in the req.body
router.route('/getStatus').get(getStatus);
router.route('/getTotalNumber').get(getTotalNumber);

module.exports = router;