const admin = require("firebase-admin");
const apiError = require("../Utils/apiError");
const {getAuth} = require("firebase-admin/auth");



const decodeToken = (req, res, next) => {
    const token = req.headers.authorization;

    getAuth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            req.userId = decodedToken.uid;
            return next();
        })
        .catch((error) => {
            return next(new apiError("Invalid token, please login to access this route", 401));
        });
}

module.exports = decodeToken;