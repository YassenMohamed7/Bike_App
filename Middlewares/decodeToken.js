const admin = require("firebase-admin");
const apiError = require("../Utils/apiError");



const decodeToken = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        const decodedValue = admin.auth().verifyIdToken(token);
        if (decodedValue) {
            return next();
        }
        else
        {
            next(new apiError("Un authorized access!", 403));
        }
    }catch (e){
        res.status(500).json(e);
    }
}

module.exports = decodeToken;