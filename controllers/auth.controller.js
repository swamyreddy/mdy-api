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
    try {
        // Check validation errors

        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                status: "Error",
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        return res.status(201).json({
            status: "Success",
            message: "User registered successfully",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error",
        });
    }
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
