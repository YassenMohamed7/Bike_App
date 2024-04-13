// @Desc this class is responsible for predictable errors

class ApiError extends Error {
    constructor(message, status)
    {
        super(message);
        this.status= status;
        this.statusType = `${status}`.startsWith('4')?"fail" : "error";
        this.isOperational = true
    }
}

module.exports = ApiError;