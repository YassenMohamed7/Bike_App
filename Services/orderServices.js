const orders = require('../Models/orders');
const asyncHandler = require('express-async-handler');
const booking = require('../Models/booking');
const vehicle = require("../Models/vehicleProfile");
const users = require("../Models/users");
const apiError = require("../Utils/apiError");


exports.getOrders = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.params.page) || 1; // Ensure page is a number (default 1)
    const limit = 10;
    const startIndex = (page - 1) * limit;
    try {
        const query = booking.orderBy('Booking_Date').startAt(startIndex).limit(limit);
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




exports.getWeeklyOreders = asyncHandler(async (req, res) => {
    const now = FirebaseFirestore.Timestamp.now();
    const nowMillis = now.toMillis();
    const sixDaysAgoMillis = nowMillis - (6 * 24 * 60 * 60 * 1000);
    const sixDaysAgoTimestamp = new FirebaseFirestore.Timestamp(sixDaysAgoMillis);
    const query = orders.where('date', ">=", sixDaysAgoTimestamp);
    query.get().then((snapshot => {
        if (snapshot.empty) {
            // there is no orders this week.
            return;
        }
        const users = new Set();
        const totalRents = snapshot.docs.length;
        snapshot.forEach((doc) => {
            const orederId = doc.Customer_Id;
            users.add(orederId);
        });
    }))

})