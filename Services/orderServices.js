const asyncHandler = require('express-async-handler');
const booking = require('../Models/booking');
const vehicle = require("../Models/vehicleProfile");
const users = require("../Models/users");
const apiError = require("../Utils/apiError");

// get total orders of specific user
// route: GET api/v1/orders/getOrders
// access: private
// passing page and customerId in the request body
exports.getOrders = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.body.page) || 1; // Ensure page is a number (default 1)
    const customerId = req.body.customerId;
    const limit = 10;

    let query = booking
        .where('Customer_Id', '==', customerId)
        .orderBy('Booking_Date')
        .limit(limit);

    // If it's not the first page, get the last document from the previous page
    if (page > 1) {
        const lastVisibleQuery = await booking
            .where('Customer_Id', '==', customerId)
            .orderBy('Booking_Date')
            .limit((page - 1) * limit)
            .get();

        const lastVisible = lastVisibleQuery.docs[lastVisibleQuery.docs.length - 1];
        query = query.startAfter(lastVisible);
    }

    try {
        const snapshot = await query.get();

        const orders = await Promise.all(snapshot.docs.map(async (doc) => {
            const orderData = doc.data() || {};
            const { Booking_Id, Customer_Id, Start_Date, End_Date, Total_Amount, Status, Vehicle_Id } = orderData;

            // Fetch vehicle and user data concurrently
            const [vehicleSnapshot, userSnapshot] = await Promise.all([
                vehicle.doc(Vehicle_Id).get(),
                users.doc(Customer_Id).get(),
            ]);

            let Product_Name = null;
            let Customer_Name = null;

            if (vehicleSnapshot.exists) {
                Product_Name = vehicleSnapshot.data().Vehicle_Name;
            } else {
                throw new apiError(`Vehicle with ID: ${Vehicle_Id} not found`, 404);
            }

            if (userSnapshot.exists) {
                const { First_Name = {}, Last_Name = {} } = userSnapshot.data();
                Customer_Name = `${First_Name?.["First Name"] || ""} ${Last_Name?.["Last Name"] || ""}`; // Handle potentially missing fields
            } else {
                throw new apiError(`Customer with ID: ${Customer_Id} not found`, 404);
            }

            return { Booking_Id, Customer_Name, Product_Name, Start_Date, End_Date, Total_Amount, Status };
        }));

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
});



// passing customerId in the request body
exports.getTotalOrders = asyncHandler(async (req, res, next) => {
    const customerId = req.body.customerId;

    try {
        // Query to count total orders for a specific customer
        const snapshot = await booking.where('Customer_Id', '==', customerId).get();

        // Count the number of documents in the snapshot
        const totalOrders = snapshot.size;

        res.status(200).json({ totalOrders });
    } catch (err) {
        next(err);
    }
});
