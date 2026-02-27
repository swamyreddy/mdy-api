const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Property = sequelize.define("properties", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    isMultipleProperties: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    defaultPic: Sequelize.STRING,
    defaultPicUrl: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
            const path = this.getDataValue("defaultPic");
            if (!path) return null;
            return `http://localhost:3001/images/${path}`;
        },
        set(value) {
            throw new Error("Do not try to set the value!");
        },
    },
    propertyType: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unitType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    bathRooms: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    builtupArea: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    carpetArea: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    totalFloors: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    propertyAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    modifiedBy: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    facing: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    projectAreaValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },

    projectAreaUnit: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    projectAreaInSqYards: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

module.exports = Property;
