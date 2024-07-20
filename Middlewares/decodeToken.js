const admin = require("firebase-admin");
const apiError = require("../Utils/apiError");
const {getAuth} = require("firebase-admin/auth");
const employees = require('../Models/employees');



const decodeToken = (req, res, next) => {
    if(req.originalUrl.endsWith('login') || req.originalUrl.endsWith('signup') || req.originalUrl.endsWith('resetPassword')) {
        return next();
    }
    const token = req.headers.authorization;
    getAuth()
        .verifyIdToken(token)
        .then(async (decodedToken) => {
            req.userId = decodedToken.uid;
            const userRef = employees.doc(req.userId);
            const user = await userRef.get();
            if (user.exists)
                return next();
            else
                return next(new apiError("user not found", 404))
        })
        .catch((error) => {
            return next(new apiError("Invalid token, please login to access this route", 401));
        });
}

module.exports = decodeToken;