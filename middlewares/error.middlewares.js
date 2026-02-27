const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // MySQL duplicate key error example
    if (err.code === "ER_DUP_ENTRY") {
        statusCode = 400;
        message = "Duplicate entry detected";
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    // Development mode (detailed error)
    if (process.env.NODE_ENV === "development") {
        return res.status(statusCode).json({
            success: false,
            status: err.status || "error",
            message,
            stack: err.stack,
            error: err,
        });
    }

    // Production mode (clean response)
    return res.status(statusCode).json({
        success: false,
        status: err.status || "error",
        message,
    });
};

module.exports = errorMiddleware;
