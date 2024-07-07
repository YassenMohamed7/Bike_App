const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const apiError = require("../Utils/apiError");
const employees = require('../Models/employees');
const uploadImage = require("../Utils/uploadImageToBucket");
const { auth } = require('../Config/firebaseClient');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");



exports.signup = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;

    const userCredential = await createUserWithEmailAndPassword(auth, provided_data.Email, provided_data.Password);
    const user = userCredential.user;

    const data = {
        Employee_Id: user.uid,
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
    if(file) {
        uploadImage(file, async (err, _imageUrl) => {
            if (err) {
                next(new apiError("Error Uploading Image", 500));
            } else {
                data.Image = _imageUrl;
                await employees.doc(data.Employee_Id).set(data);
                res.status(201).json({token : await user.getIdToken(), data});

            }
        });
    }else {
        await employees.doc(data.Employee_Id).set(data);
        res.status(201).json({token : await user.getIdToken(), data});

    }

});



exports.login = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, provided_data.Email, provided_data.Password);
        const user = userCredential.user;

        const snapshot = await employees.doc(user.uid).get();
        const userData = snapshot.data();
        res.status(200).json({token : await user.getIdToken(), userData});
    }
    catch (error){
        const errorMessage = 'Login failed. Please try again later.';
        next(new apiError(errorMessage, 401));
    }

});