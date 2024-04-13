const express = require("express");
const asyncHandler = require("express-async-handler");
const { Timestamp } = require('firebase-admin/firestore');
const payments = require("../Models/payments");

exports.getAllPayments = asyncHandler(async (req, res, next)=>{
    const snapshot = await payments.get();
    const docs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(docs);
})



exports.addPayment = asyncHandler(async (req, res, next) => {
    const data = req.body;
    const payment = {
        Payment_Id: data.Payment_Id,
        Payment_Method: data.Payment_Method,
        Card_Number: data.Card_Number,
        Customer_Id: data.Customer_Id,
        Date: Timestamp.now(),
        Status: data.Status,  // [Successful, Canceled, Refunded, Pending]
        Order_Id: data.Order_Id,
        Fees_Description: data.Fees_Description
    }

    await payments.doc(`${data.Payment_Id}`).create(payment);
    res.redirect('/api/v1/payments/getAllPayments');
})