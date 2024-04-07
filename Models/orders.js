const db = require("../Config/connection");



const orders = db.collection("orders");


module.exports = orders;
