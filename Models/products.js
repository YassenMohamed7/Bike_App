const db = require("../Config/connection");


const products = db.collection("products");


module.exports = products;
