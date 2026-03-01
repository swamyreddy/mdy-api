const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Property = require("./property.model");
const Unit = sequelize.define("units", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    unitName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unitPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unitSpace: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unitFloorPlan: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    unitFloorPlanUrl: {
        type: DataTypes.VIRTUAL,
        get() {
            const path = this.getDataValue("unitFloorPlan");
            if (!path) return null;
            return `${process.env.API_URL}/images/${path}`;
        },
        set(value) {
            throw new Error("Do not try to set the value!");
        },
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});
Unit.associate = (models) => {
    Unit.belongsTo(models.Property, {
        foreignKey: "propertyId",
    });
};
Property.hasMany(Unit, {
    foreignKey: "propertyId",
    as: "units",
    onDelete: "CASCADE",
});
Unit.belongsTo(Property, { foreignKey: "propertyId" });

module.exports = Unit;
