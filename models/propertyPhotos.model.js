require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Property = require("./property.model");

const PropertyPhotos = sequelize.define("propertyphotos", {
    imageUrl: DataTypes.STRING,
    title: DataTypes.STRING,
    fullImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
            const path = this.getDataValue("imageUrl");
            if (!path) return null;
            return `${process.env.API_URL}/images/${path}`;
        },
        set(value) {
            throw new Error("Do not try to set the value!");
        },
    },
});

module.exports = PropertyPhotos;
