const db = require("../Config/connection");


const products = db.collection("Products");


module.exports = products;
