const {db} = require("../Config/connection");



const reviews = db.collection("Reviews");

module.exports = reviews;
