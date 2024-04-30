const users = require('../Models/users');
const asyncHandler = require('express-async-handler');
const products = require("../Models/products");
const apiError = require("../Utils/apiError");


// get all Users data
// route: GET api/v1/users
// access: private
// Yassin Marie should do the filtering (Active and Blocked) at the client-side


exports.getUsers = asyncHandler(async (req, res) => {
    const data = [];
    const page = req.params.page || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;

    const query = users.orderBy('First_Login').startAt(startIndex).limit(limit);
    const snapshot = await query.get();
    snapshot.forEach((doc) =>{
        const {Customer_Id,  First_Name = {},Last_Name = {}, Balance, Active, Orders = 0 } = doc.data() || {};
        const First = First_Name["First Name"];
        const Last = Last_Name["Last_Name"];
        const FirstName = First[First.length - 1];
        const LastName = Last[Last.length - 1];

        data.push({Customer_Id, FirstName, LastName, Balance, Active, Orders});
    })
    res.status(200).json(data);
})


// get specific User data
// route: GET api/v1/users/getSpecificUser?Customer_Id
// access: private
// Yassin Marie should do the filtering (Active and Blocked) at the client-side


exports.getSpecificUser = asyncHandler(async (req, res, next) =>{
    const Customer_Id = req.params.Customer_Id;
    console.log(Customer_Id);
    try{
        const docRef = users.doc(Customer_Id);
        const snapshot = await docRef.get();
        if (snapshot.exists)
        {
            res.status(200).json(snapshot.data());
        }else {
            next(new apiError(`document with ${Customer_Id} is not exists`, 404));
        }
    } catch (err) {
        next(new apiError("internal server error", 500));
    }
})

