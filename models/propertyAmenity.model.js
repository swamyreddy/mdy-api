const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const PropertyAmenity = sequelize.define("propertyamenities", {
    propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    amenityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = PropertyAmenity;
