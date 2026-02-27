const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

/**
 * Generate Token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Register
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and password required", 400);
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
        throw new AppError("User already exists", 400);
    }

    const newUser = { id: Date.now(), email, password };
    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
    });
});

/**
 * Login
 */
exports.login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400));
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new AppError("Incorrect password", 401));
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
        });

        res.status(200).json({
            status: "success",
            token,

            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Logout
 */
exports.logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({
        success: true,
        message: "Logged out successfully",
    });
});

/**
 * Get Current User
 */
exports.getMe = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
