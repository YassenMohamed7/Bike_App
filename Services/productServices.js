const products = require('../Models/products');
const asyncHandler = require('express-async-handler');
const { Timestamp } = require('firebase-admin/firestore');


// get all products
// route: GET api/v1/products
// access: private


exports.getProducts = asyncHandler(async (req, res) => {
    const snapshot = await products.get();   // it returns a snapshot of the collection
    // docs is a list of objects each object is a document.
    const docs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(docs);
})


// get specific product 
// route: GET api/v1/products/:id
// access: private

exports.getSpecificProduct = asyncHandler(async (req, res) => {
    const docId = req.params.id;
    const docRef = products.doc(docId);
    const doc = await docRef.get();
    console.log(`Doc = ${doc}`);
    if (!doc.exists)
        throw new Error(`Doc with this id ${docId} is not existed`);
    
    res.status(200).json(doc.data());
})

// add new product 
// route: POST api/v1/products
// access: private


exports.addProduct = asyncHandler(async (req, res) => {
    const provided_data = req.body;
    const data = {
        Last_Modification:{
            Timestamp: Timestamp.now(),
            Modifier: [provided_data.email]
        },
        Vehicle_Id: provided_data.id,
        Vehicle_Name: provided_data.name,
        Vehicle_Description: provided_data.description,
        Vehicle_Image: provided_data.image,
        Vehicle_Type: provided_data.type,
        Vehicle_Category: provided_data.category,// Category Id
        Register_Date: Timestamp.now(),
        Price: provided_data.price,
        Inventory_Code: provided_data.inventoryCode,
        Size: provided_data.size,
        Color: provided_data.color,
        Features: provided_data.features,
        Wheel_Size: provided_data.wheelSize,
        Expire_Date: Timestamp.now(),
        Suspension_Type: provided_data.suspension,
        Included_Component: provided_data.includedComponents,
        Rent_Times: 0, // counter instead of complex query driven from orders and it is zero at the beginnig
        Tax: provided_data.tax, // index of the class
        VAT_Amount: provided_data.vat,
        Weight: provided_data.weight,
        Height: provided_data.height,
        Length: provided_data.length,
        Width: provided_data.width,
        Battery_Life: provided_data.batteryLife,
        Work_Hours: provided_data.workHours,
        Distance: provided_data.distance,// measured in km 
        Speed: provided_data.speed,
        Brand: provided_data.brand,
        status: provided_data.status
    }
    console.log(data)

    await products.doc(`${provided_data.id}`).create({data});
    res.redirect('/api/v1/products');
})


// edit existing product
// route: POST api/v1/products
// access: private

exports.editProduct = asyncHandler(async (req, res) => {

})





