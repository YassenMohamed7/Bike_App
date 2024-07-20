const asyncHandler = require("express-async-handler");

const apiError = require("../Utils/apiError");
const employees = require('../Models/employees');
const uploadImage = require("../Utils/uploadImageToBucket");
const { auth } = require('../Config/firebaseClient');
const { createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        generatePasswordResetLink
    } = require("firebase/auth");



exports.signup = asyncHandler(async (req, res, next) => {
    const provided_data = req.body;
    const file = req.file;
    let user;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, provided_data.email, provided_data.password);
         user = userCredential.user;
    }catch (error){
       return next(new apiError("Email is already used", 409));
    }
    const data = {
        Employee_Id: user.uid,
        First_Name: provided_data.first,
        Last_Name: provided_data.last,
        Job_Title: null,
        Phone: provided_data.phone,
        Email: provided_data.email,
        Location: null,
        Completed_Services: {
            onTime: 0,
            delayed: 0
        },
        In_Progress_Services: {
            withinDuration: 0,
            delayed: 0
        },
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
        const userCredential = await signInWithEmailAndPassword(auth, provided_data.email, provided_data.password);
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



exports.resetPassword = asyncHandler(async (req, res, next) =>{
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const link = await generatePasswordResetLink(email).then(async (link) => {
            // Send email using your preferred email service provider
            await sendPasswordResetEmail(email, link);
            res.status(200).send({message: 'Password reset email sent'});

        })
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



const sendPasswordResetEmail = async (email, link) => {
    // Use your preferred email service provider to send the email
    // Example using nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'yassenmohammed871@gmail.com',
            pass: 'Yassen_Mohamed123#'
        }
    });

    const mailOptions = {
        from: 'yassenmohammed871@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${link}`,
        html: `<p>Click on the following link to reset your password: <a href="${link}">${link}</a></p>`
    };

    await transporter.sendMail(mailOptions);
};