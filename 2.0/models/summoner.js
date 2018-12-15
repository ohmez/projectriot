'use strict';
module.exports = (sequelize, DataTypes) => {
  const Summoner = sequelize.define('Summoner', {
    summName: DataTypes.STRING,
    summID: DataTypes.STRING,
    summIcon: DataTypes.STRING,
    summLvl: DataTypes.STRING,
    accID: DataTypes.STRING,
    revisDate: DataTypes.STRING
  }, {});
  Summoner.associate = function(models) {
    // associations can be defined here
  };
  return Summoner;
};