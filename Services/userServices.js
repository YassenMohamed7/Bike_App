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
    const page = parseInt(req.params.page) || 1;
    const active = req.params.active;
    const limit = 8;

    let query = users.orderBy('First_Login')

    if(active === 'Active'){
        query = query.where('Active', '==', true);
    }else if (active === 'Blocked'){
        query = query.where('Active', '==', false);
    }

    if (page > 1) {

        let previousPageSnapshot =  users.orderBy('First_Login')

        if(active === 'true')
            previousPageSnapshot = previousPageSnapshot.where('Active', '==', true)
        else if(active === 'false')
            previousPageSnapshot = previousPageSnapshot.where('Active', '==', false)


        previousPageSnapshot = previousPageSnapshot.limit((page - 1) * limit)

        const getPreviousPageSnapshot = await  previousPageSnapshot.get();

        const lastVisible = getPreviousPageSnapshot.docs[getPreviousPageSnapshot.docs.length - 1];
        query = query.startAfter(lastVisible);
    }

    const snapshot = await query.limit(limit).get();
    snapshot.forEach((doc) => {
        const { Customer_Id, Email ,First_Name = {}, Last_Name = {}, Phone = {} ,Balance, Location = {} , Active, Orders = 0 , Image, Last_Login} = doc.data() || {};
        const First = First_Name["First Name"] || [];
        const Last = Last_Name["Last_Name"] || [];
        const FirstName = First[First.length - 1] || '';
        const LastName = Last[Last.length - 1] || '';
        const name = FirstName + " " + LastName;
        const address = Location['City'] + ',' + Location['State'] + ',' + Location['Country'];
        const phoneList = Phone['Phone'];
        const phone = phoneList[phoneList.length -1];
        const _Time = (Last_Login._seconds + Last_Login._nanoseconds*10**-9)*1000;
        const date = new Date(_Time);
        const lastOnline = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: "2-digit",
            year: 'numeric'
        }).replace(/\//g, '-');
        let status = "active";
        if (Active === false)
            status = "blocked";



        data.push({
            id: Customer_Id,
            img: Image,
            name: name,
            status: status,
            orders: Orders,
            balance: Balance,
            email: Email,
            address: address,
            phone: phone,
            lastOnline: lastOnline

        });
    });

    res.status(200).json( data );
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
    const status = {
        active: usersData.filter(usersData => usersData.Active === true).length,
        new: usersData.filter(usersData => calculateDateDiff(Timestamp.now(), usersData.First_Login) <= period).length,
        inactive: usersData.filter(usersData => usersData.Active === false).length,
        deleted: usersData.filter(usersData => usersData.Delete_Account === true).length,
    };
    res.status(200).json(status);
})


// get gender of all users
// route: GET api/v1/users/getGender
// access: private


exports.getGender = asyncHandler(async (req, res) => {
    const period = parseInt(req.params.period, 10); // Ensure period is a number

    if (isNaN(period)) {
        return res.status(400).json({ message: 'Invalid period parameter' });
    }

    try {
        const usersSnapshot = await users.get();
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        // Filter users based on the period
        const recentUsers = usersData.filter(user => {
            return calculateDateDiff(Timestamp.now(), user.First_Login) <= period;
        });

        const filtered = recentUsers.map(user => user.Gender.Gender);
        console.log(filtered);

        // Count genders
        const data = {
            rather_not_to_say : filtered.filter(gender => gender.length === 0 || gender[gender.length -1] === 2).length,
            male : filtered.filter(gender => gender[gender.length -1] === 0).length,
            female : filtered.filter(gender => gender[gender.length -1] === 1).length
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

