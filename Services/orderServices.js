const orders = require('../Models/orders');
const asyncHandler = require('express-async-handler');



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