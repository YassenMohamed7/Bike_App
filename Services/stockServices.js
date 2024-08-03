const stock = require('../Models/stock');
const asyncHandler = require('express-async-handler');
const { Timestamp } = require('firebase-admin/firestore');
const apiError = require('../Utils/apiError');
const uploadImage = require('../Utils/uploadImageToBucket');
const {log} = require("node:util");




// add new product to stock
// route: POST api/v1/stock/addProduct
// access: private
exports.addProduct = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;

    const data = {
            Product_ID: provided_data.Product_ID,
            Product_Name: provided_data.Product_Name,
            Description: provided_data.Description,
            Category_Id: provided_data.Category_Id,  // does it mean categories which have image, name, id, desc?
            Tags: provided_data.Tags,     // can it be an array of strings?
            Type: provided_data.Type, // Bike, Scooter, …..
            Product_Image: null,
            Price: provided_data.Price,
            Time: Timestamp.now(),
            Amount: provided_data.Amount,
            ID_Code: provided_data.ID_Code,
            Weight: provided_data.Weight,
            Height: provided_data.Height,
            Length: provided_data.Length,
            Width: provided_data.Width,
            Status: provided_data.Status
}

    uploadImage(file, async (err, _imageUrl) => {
        if (err) {
            next(new apiError("Error Uploading Image", 500));
        } else {
            data.Product_Image = _imageUrl;
            try {
                await stock.doc(`${provided_data.Product_ID}`).create(data);

            }catch (e) {
                 return next(new apiError("Product already exists or internal server error", 500));
            }
            res.status(200).json('product is added successfully');
        }
    });



})





// get all products in the stock
// route: GET api/v1/stock/getAllProducts
// access: private

exports.getProducts = asyncHandler(async (req, res) => {
    const data = [];
    const page = req.params.page || 1;
    const status = req.params.status || null;
    const limit = 2;

    let query = stock.orderBy('Time');

    if(status === "Low Stock") {
        query = query
            .where('Status', '==', 'Low Stock');
    }
    else if(status === 'Out of Stock'){
        query = query
            .where('Status', '==', 'Out of Stock');
    }

    // If it's not the first page, get the last document from the previous page
    if (page > 1) {
        const previousPageSnapshot = await stock
            .orderBy('Time')
            .where('Status', '==', status)
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
        query = query.startAfter(lastVisible);
    }

    const snapshot = await query.limit(limit).get();
    snapshot.forEach((doc) =>{
        const {Product_ID,  Product_Name ,Time = {} , Amount, Price, Status, Product_Image} = doc.data() || {};

        const _Time = (Time._seconds + Time._nanoseconds*10**-9)*1000;
        const date = new Date(_Time);
        const time = date.toLocaleString('en-GB', {
        day: '2-digit',
            month: 'long',
            year: 'numeric'
    });

        
        data.push({Product_ID,  Product_Name ,Time: time , Amount, Price, Status, Product_Image });
    })
    res.status(200).json(data);
})


// get specific product
// route: GET api/v1/stock/getSpecificProduct/:id
// access: private

exports.getSpecificProduct = asyncHandler(async (req, res, next) => {
    const docId = req.params.id;
    try{
        const docRef = stock.doc(docId);
        const snapshot = await docRef.get();
        if (snapshot.exists)
        {
            res.status(200).json(snapshot.data());
        }else {
            next(new apiError(`document with ${docId} is not exists`, 404));
        }
    } catch (err) {
        next(new apiError("internal server error", 500));
    }
})


// edit existing product
// route: POST api/v1/stock/edit/:id
// access: private



exports.editProduct = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;
    const data = {
        Product_ID: provided_data.Product_ID,
        Product_Name: provided_data.Product_Name,
        Description: provided_data.Description,
        Category: provided_data.Category_Id,  // does it mean categories which have image, name, id, desc?
        Tags: provided_data.Tags,     // can it be an array of strings?
        Type: provided_data.Type, // Bike, Scooter, …..
        Product_Image: null,
        Date: Timestamp.now(),
        Amount: provided_data.Amount,
        ID_Code: provided_data.ID_Code,
        Weight: provided_data.Weight,
        Height: provided_data.Height,
        Length: provided_data.Length,
        Width: provided_data.Width,
        Status: provided_data.Status
    }

    uploadImage(file, async (err, _imageUrl) => {
        if (err) {
            next(new apiError("Error Uploading Image", 500));
        } else {

            data.Product_Image = _imageUrl;
            await stock.doc(`${provided_data.Product_ID}`).update(data);
        }
    });

    res.status(200).json("data is updated successfully");

})



exports.deleteProduct = asyncHandler(async (req, res, next) =>{
    const docID = req.params.id;

    const docRef = stock.doc(docID);
    docRef.delete().then(() =>{
        res.status(202).json("product is deleted successfully");
    }).catch((err) =>{
       next(new apiError('Error Deleting the product', 500));
    });
})

exports.getNumber = asyncHandler(async (req, res, next) =>{
    const status = req.params.status;

    let query = stock;
    if(status === 'Low Stock' || status === 'Out of Stock')
    query = stock
        .where('Status', '==', status);

    const data = await query.get();
    const numberOfProducts = data.docs.map(doc => doc.data()).length;

    res.status(200).json({
        total_products: numberOfProducts
    });


})