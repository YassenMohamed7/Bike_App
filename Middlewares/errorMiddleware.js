
const globalError = (err, req, res, next) => {
    err.status = err.status || 500;
    err.statusType = err.statusType || "error";
    res.status(err.status).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

module.exports = globalError;