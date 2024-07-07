const {db} = require("../Config/connection");


const products = db.collection("Bike Profile");


module.exports = products;
