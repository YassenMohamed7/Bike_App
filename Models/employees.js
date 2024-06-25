const {db} = require("../Config/connection");



const employees = db.collection("Employees");

module.exports = employees;

