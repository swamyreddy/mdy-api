const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Property = sequelize.define("properties", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    isMultipleProperties: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    defaultPic: DataTypes.STRING,
    defaultPicUrl: {
        type: DataTypes.VIRTUAL,
        get() {
            const path = this.getDataValue("defaultPic");
            if (!path) return null;
            return `${process.env.API_URL}/images/${path}`;
        },
        set(value) {
            throw new Error("Do not try to set the value!");
        },
    },
    propertyType: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unitType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bathRooms: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    builtupArea: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    carpetArea: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    propertyAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modifiedBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    facing: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    projectAreaValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    projectAreaUnit: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    projectAreaInSqYards: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Property;
