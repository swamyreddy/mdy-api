const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Amenity = sequelize.define("amenities", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Amenity;
