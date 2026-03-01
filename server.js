require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error.middlewares");
const PORT = process.env.PORT || 5000;
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Database connected");

        await sequelize.sync({ alter: true });
        console.log("Tables synced");
        console.log(Object.keys(sequelize.models));
    } catch (error) {
        console.error("Error:", error);
    }
}

connectDB();

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
