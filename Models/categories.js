const {db} = require("../Config/connection");



const categories = db.collection("Categories");


module.exports = categories;
