const asyncHandler = require("express-async-handler");
const employees = require("../Models/employees");
const uploadImage = require("../Utils/uploadImageToBucket");
const apiError = require("../Utils/apiError");



exports.getEmployees = asyncHandler(async (req, res) => {
    const data = [];
    const page = parseInt(req.params.page) || 1;
    const limit = 8;

    let query = employees.orderBy('First_Name').limit(limit);

    // If it's not the first page, get the last document from the previous page
    if (page > 1) {
        const previousPageSnapshot = await employees
            .orderBy('First_Name')
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
        query = query.startAfter(lastVisible);
    }

    const snapshot = await query.get();
    snapshot.forEach((doc) => {
        data.push(doc.data());
    });

    res.status(200).json(data);
});






