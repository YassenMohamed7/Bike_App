const products = require('../Models/products');
const asyncHandler = require('express-async-handler');
const { Timestamp } = require('firebase-admin/firestore');
const apiError = require('../Utils/apiError');
const multer = require('multer');
const uploadImage = require('../Utils/uploadImageToBucket');
const {bucket} = require("../Config/connection");



// add new product
// route: POST api/v1/products
// access: private

// @desc configuring multer for uploading single image
const multerStorage = multer.memoryStorage({
    destination: function (req, file, cb) {
        // no local storage, upload directly to Firebase bucket.
        cb(null, '');
    },
    filename: function (req, file, cb) {
        // mimetype is file_type/extension
        const ext = file.mimetype.split('/')[1];
        const filename = `${Date.now()}.${ext}`;
        cb(null, filename);
    },
});
const multerFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[0];
    if(type === 'image'){
        cb(null, true);
    }else{
        cb(new apiError("Only images are allowed", 400), false);
    }
}
const upload = multer({storage: multerStorage,
    fileFilter: multerFilter});

exports.uploadProductImage = upload.single('Vehicle_Image');




exports.addProduct = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;
    let imageUrl = null;
    uploadImage(file, (err, _imageUrl) =>{
        if(err){
            next(new apiError("Error Uploading Image", 500));
        }else{
            console.log("Image is: ", _imageUrl);
            imageUrl = _imageUrl;
        }
    });

    const data = {
        Last_Modification:{
            Timestamp: Timestamp.now(),
            Modifier: [provided_data.Email]
        },
        Vehicle_Id: provided_data.Vehicle_Id,
        Vehicle_Name: provided_data.Vehicle_Name,
        Vehicle_Description: provided_data.Vehicle_Description,
        Vehicle_Image: imageUrl,
        Vehicle_Type: provided_data.Vehicle_Type,
        Vehicle_Category: provided_data.Vehicle_Category,// Category Id
        Register_Date: Timestamp.now(),
        Price: provided_data.Price,
        Inventory_Code: provided_data.Inventory_Code,
        Size: provided_data.Size,
        Color: provided_data.Color,
        Features: provided_data.Features,
        Wheel_Size: provided_data.Wheel_Size,
        Expire_Date: Timestamp.now(),
        Suspension_Type: provided_data.Suspension_Type,
        Included_Component: provided_data.Included_Component,
        Rent_Times: provided_data.Rent_Times, // counter instead of complex query driven from orders and it is zero at the beginnig
        Tax: provided_data.Tax, // index of the class
        VAT_Amount: provided_data.VAT_Amount,
        Weight: provided_data.Weight,
        Height: provided_data.Height,
        Length: provided_data.Length,
        Width: provided_data.Width,
        Battery_Life: provided_data.Battery_Life,
        Work_Hours: provided_data.Work_Hours,
        Distance: provided_data.Distance,// measured in km
        Speed: provided_data.Speed,
        Brand: provided_data.Brand,
        Status: provided_data.Status  // true at first and false when removing the product
    }
    await products.doc(`${provided_data.Vehicle_Id}`).create(data);
    res.redirect('/api/v1/products/getAllProducts');
})





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

exports.getSpecificProduct = asyncHandler(async (req, res, next) => {
    const docId = req.params.id;
    try{
        const docRef = products.doc(docId);
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
// route: POST api/v1/products
// access: private


// Update list of modifiers of the product
const updateModifiers = (emails, currentEmail)=> {

    if (emails.includes(currentEmail)) {
        const index = emails.indexOf(currentEmail);
        emails.splice(index, 1);
    }
    emails.push(currentEmail);
    return emails;
}

exports.editProduct = asyncHandler(async (req, res, next) => {
            const docId = req.params.id;
            const newData = req.body;

            try{
                const docRef = products.doc(docId);
                const snapshot = await docRef.get();
                const oldData = snapshot.data();
                const emails = oldData.Last_Modification.Modifier || [];
                const newModifiers = updateModifiers(emails, newData.Email);
                console.log("new emails are: " + newModifiers);
               
                const productData = {
                        Last_Modification: {
                            Timestamp: Timestamp.now(),
                            Modifier: newModifiers
                        },
                        Vehicle_Id: newData.Vehicle_Id,
                        Vehicle_Name: newData.Vehicle_Name,
                        Vehicle_Description: newData.Vehicle_Description,
                        Vehicle_Image: newData.Vehicle_Image,
                        Vehicle_Type: newData.Vehicle_Type,
                        Vehicle_Category: newData.Vehicle_Category,// Category Id
                        Register_Date: Timestamp.now(),
                        Price: newData.Price,
                        Inventory_Code: newData.Inventory_Code,
                        Size: newData.Size,
                        Color: newData.Color,
                        Features: newData.Features,
                        Wheel_Size: newData.Wheel_Size,
                        Expire_Date: Timestamp.now(),
                        Suspension_Type: newData.Suspension_Type,
                        Included_Component: newData.Included_Component,
                        Rent_Times: newData.Rent_Times, // counter instead of complex query driven from orders and it is zero at the beginning
                        Tax: newData.Tax, // index of the class
                        VAT_Amount: newData.VAT_Amount,
                        Weight: newData.Weight,
                        Height: newData.Height,
                        Length: newData.Length,
                        Width: newData.Width,
                        Battery_Life: newData.Battery_Life,
                        Work_Hours: newData.Work_Hours,
                        Distance: newData.Distance,// measured in km
                        Speed: newData.Speed,
                        Brand: newData.Brand,
                        Status: newData.Status
                    };

                await docRef.update(productData);
                res.redirect('/api/v1/products/getAllProducts');

            }
            catch (e) {
                next(new apiError("internal server error", 500));
            }
})





