'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mastery = sequelize.define('Mastery', {
    summID: DataTypes.STRING,
    playerID: DataTypes.STRING,
    championID: DataTypes.STRING,
    championLvl: DataTypes.STRING,
    championPoints: DataTypes.STRING,
    lastPlayed: DataTypes.STRING,
    pointsSinceLastLvl: DataTypes.STRING,
    pointsUntilNextLvl: DataTypes.STRING,
    chestGranted: DataTypes.BOOLEAN,
    tokensEarned: DataTypes.STRING
  }, {});
  Mastery.associate = function(models) {
    // associations can be defined here
  };
  return Mastery;
};