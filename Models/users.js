const {db} = require('../Config/connection');

const users = db.collection("User Profile");

module.exports = users;



