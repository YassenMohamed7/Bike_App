const asyncHandler = require("express-async-handler");
const apiError = require("../Utils/apiError");
const jwt = require("jsonwebtoken");

const employees = require('../Models/employees');
const uploadImage = require("../Utils/uploadImageToBucket");


exports.signup = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;

    const newDocRef = employees.doc();

    const data = {
        Employee_Id: newDocRef.id,
        First_Name: provided_data.First_Name,
        Last_Name: provided_data.Last_Name,
        Job_Title: provided_data.Job_Title|| null,
        Phone: provided_data.Phone,
        Email: provided_data.Email,
        Location: provided_data.Location || null,
        Completed_Services: 0,
        Inprogress_Services: 0,
        Image: null
    };
    const token = jwt.sign({userId: data.Employee_Id},
        process.env.JWT_SERCRET_KEY,
        {expiresIn: process.env.JWT_EXPIRE}
    );
    if(file) {
        uploadImage(file, async (err, _imageUrl) => {
            if (err) {
                next(new apiError("Error Uploading Image", 500));
            } else {
                data.Image = _imageUrl;
            }
        });
    }
    await newDocRef.set(data);
    res.status(201).json({data: data, token: token});
});
