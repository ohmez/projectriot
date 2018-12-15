'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Masteries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      summID: {
        type: Sequelize.STRING
      },
      playerID: {
        type: Sequelize.STRING
      },
      championID: {
        type: Sequelize.STRING
      },
      championLvl: {
        type: Sequelize.STRING
      },
      championPoints: {
        type: Sequelize.STRING
      },
      lastPlayed: {
        type: Sequelize.STRING
      },
      pointsSinceLastLvl: {
        type: Sequelize.STRING
      },
      pointsUntilNextLvl: {
        type: Sequelize.STRING
      },
      chestGranted: {
        type: Sequelize.BOOLEAN
      },
      tokensEarned: {
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
    return queryInterface.dropTable('Masteries');
  }
};