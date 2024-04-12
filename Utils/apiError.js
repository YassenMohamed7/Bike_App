// @Desc this class is responsible for predictable errors

class ApiError extends Error {
    constructor(message, statusCode)
    {
        super(message);
        this.status= statusCode;
        this.statusType = `${statusCode}`.startsWith('4')?"fail" : "error";
        this.isOperational = true
    }
}

module.exports = ApiError;