const {db} = require("../Config/connection");



const orders = db.collection("Orders");


module.exports = orders;
