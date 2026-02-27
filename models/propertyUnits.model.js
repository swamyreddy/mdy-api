const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const PropertyUnit = sequelize.define("propertyunits", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = PropertyUnit;
