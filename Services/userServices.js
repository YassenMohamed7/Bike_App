const users = require('../Models/users');
const asyncHandler = require('express-async-handler');
const apiError = require("../Utils/apiError");
const { Timestamp } = require('firebase-admin/firestore');
const calculateDateDiff = require('../Utils/calculateDateDiff');


// get all Users data
// route: GET api/v1/users?page=...&active=...
// access: private

exports.getUsers = asyncHandler(async (req, res) => {
    const data = [];
    const page = parseInt(req.body.page) || 1;
    const active = req.body.active;
    const limit = 10;
    let query;


    if(active === undefined)
        query  = users.orderBy('First_Login').limit(limit);
    else if(active === true)
        query = users
            .where('Active', '==', true)
            .limit(limit);
    else
        query = users
            .where('Active', '==', false)
            .limit(limit);

    // If it's not the first page, get the last document from the previous page
    if (page > 1) {
        const previousPageSnapshot = await users
            .orderBy('First_Login')
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
        query = query.startAfter(lastVisible);
    }

    const snapshot = await query.get();
    snapshot.forEach((doc) => {
        const { Customer_Id, First_Name = {}, Last_Name = {}, Balance, Active, Orders = 0 } = doc.data() || {};
        const First = First_Name["First Name"];
        const Last = Last_Name["Last_Name"];
        const FirstName = First[First.length - 1];
        const LastName = Last[Last.length - 1];

        data.push({ Customer_Id, FirstName, LastName, Balance, Active, Orders });
    });

    res.status(200).json(data);
});




// get specific User data
// route: GET api/v1/users/getSpecificUser?Customer_Id
// access: private
// Yassin Marie should do the filtering (Active and Blocked) at the client-side


exports.getSpecificUser = asyncHandler(async (req, res, next) =>{
    const Customer_Id = req.params.Customer_Id;
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

// get number of total users
// route: GET api/v1/users/getTotal
// access: private


exports.getTotal = asyncHandler(async (req, res)=>{
    const usersSnapshot = await users.get();
    const totalUsers = usersSnapshot.size;
    res.json({ totalUsers });
})


// get status of all users
// route: GET api/v1/users/getUserStatus
// access: private

exports.getUserStatus = asyncHandler(async (req, res) => {
    const period = req.params.period; // period should be in days.


    const usersSnapshot = await users.get();
    const usersData = usersSnapshot.docs.map(doc => doc.data());
    const stats = {
        active: usersData.filter(usersData => usersData.Active === true).length,
        new: usersData.filter(usersData => calculateDateDiff(Timestamp.now(), usersData.First_Login) <= period).length,
        inactive: usersData.filter(usersData => usersData.Active === false).length,
        deleted: usersData.filter(usersData => usersData.Delete_Account === true).length,
    };
    res.json(stats);
})


// get gender of all users
// route: GET api/v1/users/getGender
// access: private

exports.getGender = asyncHandler(async (req, res) =>{
    const usersSnapshot = await users.get();
    const usersData = usersSnapshot.docs.map(doc => doc.data().Gender.Gender);

    const data = {
        male : usersData.filter(gender => gender[gender.length -1] === 0).length,
        female : usersData.filter(gender => gender[gender.length -1] === 1).length,
        rather_not_to_say : usersData.filter(gender => gender.length === 0 || gender[gender.length -1] === 2).length,
    }
    res.status(200).json(data);
})

