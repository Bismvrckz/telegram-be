"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bots.hasMany(models.users, {
        foreignKey: "bot_token",
      });
    }
  }
  bots.init(
    {
      bot_token: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "bots",
      paranoid: true,
    }
  );
  return bots;
};
