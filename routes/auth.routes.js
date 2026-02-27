const express = require("express");
const router = express.Router();

const {
    register,
    login,
    logout,
    getMe,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middlewares");

// Public routes
router.post("/register", register);
router.post("/signin", login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
