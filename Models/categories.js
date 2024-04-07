const db = require("../Config/connection");



const categories = db.collection("categories");


module.exports = categories;
