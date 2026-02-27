const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Property = require("./property.model");
const PropertyAmenity = require("./propertyAmenity.model");

const Amenity = sequelize.define("amenities", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Amenity;
