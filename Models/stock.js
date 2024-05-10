const {db} = require("../Config/connection");


const Stock = db.collection("Stock");


module.exports = Stock;
