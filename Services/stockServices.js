const stock = require('../Models/stock');
const asyncHandler = require('express-async-handler');
const { Timestamp } = require('firebase-admin/firestore');
const apiError = require('../Utils/apiError');
const uploadImage = require('../Utils/uploadImageToBucket');






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
            console.log("Image is: ", _imageUrl);
            data.Product_Image = _imageUrl;
            await stock.doc(`${provided_data.Product_ID}`).create(data);
        }
    });

    res.redirect(`/api/v1/stock/getAllProducts`);
})





// get all products in the stock
// route: GET api/v1/stock/getAllProducts
// access: private

exports.getProducts = asyncHandler(async (req, res) => {
    const data = [];
    const page = req.params.page || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;

    const query = stock.orderBy('Date').startAt(startIndex).limit(limit);
    const snapshot = await query.get();
    snapshot.forEach((doc) =>{
        const {Product_ID,  Product_Name ,Date , Amount, Price, Status, Product_Image} = doc.data() || {};

        data.push({Product_ID,  Product_Name ,Date , Amount, Price, Status, Product_Image });
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
            console.log("Image is: ", _imageUrl);
            data.Product_Image = _imageUrl;
            await stock.doc(`${provided_data.Product_ID}`).update(data);
        }
    });

    res.redirect(`/api/v1/stock/getSpecificProduct/:${data.Product_ID}`);

})



exports.deleteProduct = asyncHandler(async (req, res, next) =>{
    const docID = req.body.id;
    const docRef = stock.doc(docID);
    docRef.delete().then(() =>{
        res.redirect(`/api/v1/stock/getSpecificProduct/:${data.Product_ID}`);
    }).catch((err) =>{
       next(new apiError(`Error Deleting the product}`, 500));
    });
})