require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error.middlewares");
const PORT = process.env.PORT || 5000;

sequelize
    .authenticate()
    .sync({ alter: true })
    .then(() => console.log("DB connected"))
    .catch((err) => console.error(err));

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
