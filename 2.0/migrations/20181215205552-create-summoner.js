'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Summoners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      summName: {
        type: Sequelize.STRING
      },
      summID: {
        type: Sequelize.STRING
      },
      summIcon: {
        type: Sequelize.STRING
      },
      summLvl: {
        type: Sequelize.STRING
      },
      accID: {
        type: Sequelize.STRING
      },
      revisDate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Summoners');
  }
};