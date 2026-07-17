const express = require("express");
const { register, login } = require("../controllers/auth.contoller");
const authRoutes = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.get("/me", authMiddleware, async (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
});

module.exports = authRoutes;