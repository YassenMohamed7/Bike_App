const db = require("../Config/connection");

const payments = db.collection("Payments");


module.exports = payments;