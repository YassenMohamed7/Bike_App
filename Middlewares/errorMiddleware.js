
// globalError must include the next parameter to be an error handling function
const globalError = (err, req, res, next) => {
    err.status = err.status || 500;
    err.statusType = err.statusType || "error";

    if (process.env.ENVIRONMENT === 'development') {
            sendToDevelopment(err, res);
    }else{
            sendToProduction(err, res);
    }
}


const sendToDevelopment = (err, res)=>{
    return  res.status(err.status).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}
const sendToProduction = (err, res)=>{
    return  res.status(err.status).json({
        status: err.status,
        message: err.message,
    });
}
module.exports = globalError;