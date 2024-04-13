const users = require('../Models/users');
const asyncHandler = require('express-async-handler');


// get all Users data
// route: GET api/v1/users
// access: private
// Yassin Marie should do the filtering (Active and Blocked) at the client-side


exports.getUsers = asyncHandler(async (req, res) => {
    const snapshot = await users.get();
    const data = [];

    snapshot.forEach((doc) =>{
        const { First_Name = {},Last_Name = {}, Balance, Active, Orders = 0 } = doc.data() || {};
        const FirstName = First_Name["First Name"];
        const LastName = Last_Name["Last_Name"];

        const LastElementOfFirstName = FirstName[FirstName.length - 1];
        const LastElementOfLastName = LastName[LastName.length - 1];
        data.push({LastElementOfFirstName, LastElementOfLastName, Balance, Active, Orders});
    })
    res.status(200).json(data);
})






//          To get page by page odf users

// exports.getUsers = asyncHandler(async (req, res) => {
//     const page = req.params.page || 1;
//     const limit = 10;
//     const startIndex = (page - 1) * limilt;
//
//     const query = users.orderBy('First_Login').startAt(startIndex).limit(limit);
//     const usersSnapshot = await query.get();
//     const _users = [];
//
//     usersSnapshot.forEach((doc) => {
//         const _orders = orders.where('Customer_Id', "==", doc.Customer_Id);
//         _users.push({
//             "name": `${doc.First_Name.First_Name}`,
//             "status": `${doc.Status}`,
//             "Balance": `${doc.Balance}`,
//             "Orders":   _orders
//         });
//     });
//     res.status(200).json(_users);
// })


