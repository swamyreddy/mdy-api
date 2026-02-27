"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addColumn("properties", "description", {
            allowNull: false,
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn("properties", "totalFloors", {
            allowNull: false,
            type: Sequelize.INTEGER,
        });
        await queryInterface.addColumn("properties", "propertyAge", {
            allowNull: false,
            type: Sequelize.INTEGER,
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn("properties", "propertyAge");
        await queryInterface.removeColumn("properties", "totalFloors");
        await queryInterface.removeColumn("properties", "description");
    },
};
