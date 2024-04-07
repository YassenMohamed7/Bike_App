const users = require('../Models/users');
const orders = require('../Models/orders');

const asyncHandler = require('express-async-handler');
const orders = require('../Models/orders');


exports.getUsers = asyncHandler(async (req, res) => {
    const page = req.params.page || 1;
    const limit = 10;
    const startIndex = (page - 1) * limilt;

    const query = users.orderBy('First_Login').startAt(startIndex).limit(limit);
    const usersSnapshot = await query.get();
    const _users = [];
    
    usersSnapshot.forEach((doc) => {
        const _orders = orders.where('Customer_Id', "==", doc.Customer_Id);
        _users.push({
            "name": `${doc.First_Name.First_Name}`,
            "status": `${doc.Status}`,
            "Balance": `${doc.Balance}`,
            "Orders":   _orders
        });
    });
    res.status(200).json(_users);
})


