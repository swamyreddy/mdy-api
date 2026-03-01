const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Property = require("./property");

const PropertyPhotos = sequelize.define("propertyphotos", {
    imageUrl: DataTypes.STRING,
    title: DataTypes.STRING,
    fullImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
            const path = this.getDataValue("imageUrl");
            if (!path) return null;
            return `http://localhost:3001/images/${path}`;
        },
        set(value) {
            throw new Error("Do not try to set the value!");
        },
    },
});

Property.hasMany(PropertyPhotos, {
    foreignkey: "propertyId",
    as: "photos",
    onDelete: "CASCADE",
});
PropertyPhotos.belongsTo(Property, { foreignkey: "propertyId" });

module.exports = PropertyPhotos;
