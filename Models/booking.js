const {db} = require("../Config/connection");



const booking = db.collection("Booking");

module.exports = booking;
