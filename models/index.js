const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

// User.hasMany(Property);
// Property.belongsTo(User);
const Property = require("./property.model");
const Unit = require("./unit.model");
const PropertyPhoto = require("./propertyPhotos.model");
const Amenity = require("./amenity.model");
const PropertyAmenity = require("./propertyAmenity.model");
const PropertyUnit = require("./propertyUnits.model");

// 🔥 Define relationship
Property.hasMany(PropertyPhoto, { as: "photos", foreignKey: "propertyId" });

Property.belongsToMany(Amenity, {
    through: PropertyAmenity,
    foreignKey: "propertyId",
    otherKey: "amenityId",
    as: "amenities",
});

Amenity.belongsToMany(Property, {
    through: PropertyAmenity,
    foreignKey: "amenityId",
    otherKey: "propertyId",
});
Property.hasMany(Unit, { foreignKey: "propertyId" });
PropertyPhoto.belongsTo(Property, { foreignKey: "propertyId" });
Unit.belongsTo(Property, { foreignKey: "propertyId" });
module.exports = {
    sequelize,

    Property,
    Unit,
    Amenity,
    PropertyUnit,
    PropertyAmenity,
    PropertyPhoto,
};
sequelize.sync();
