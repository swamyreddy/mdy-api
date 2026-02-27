require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorMiddleware = require("./middlewares/error.middlewares");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL, // must be exact
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);

app.use(errorMiddleware);

module.exports = app;
