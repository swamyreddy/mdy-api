const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

exports.protect = (req, res, next) => {
    console.log(req.cookies, "req.cookies.token++=");
    const token = req.cookies.token;

    if (!token) {
        return next(new AppError("Not authorized", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
};
