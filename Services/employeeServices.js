const asyncHandler = require("express-async-handler");
const employees = require("../Models/employees");
const uploadImage = require("../Utils/uploadImageToBucket");
const apiError = require("../Utils/apiError");



// it is replaced by auth/signup


// exports.addEmployee = asyncHandler(async (req, res, next) => {
//     const provided_data = req.body;
//     const file = req.file;
//
//     const newDocRef = employees.doc();
//
//     const data = {
//         Employee_Id: newDocRef.id,
//         First_Name: provided_data.First_Name,
//         Last_Name: provided_data.Last_Name,
//         Job_Title: provided_data.Job_Title|| null,
//         Phone: provided_data.Phone,
//         Email: provided_data.Email,
//         Location: provided_data.Location || null,
//         Completed_Services: 0,
//         Inprogress_Services: 0,
//         Image: null
//     };
//     if(file) {
//         uploadImage(file, async (err, _imageUrl) => {
//             if (err) {
//                 next(new apiError("Error Uploading Image", 500));
//             } else {
//                 data.Image = _imageUrl;
//
//                 await newDocRef.set(data);
//                 res.status(200).json(`Employee is added successfully.`);
//             }
//         });
//     }else {
//         await newDocRef.set(data);
//         res.status(200).json(`Employee is added successfully.`);
//     }
// });


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






