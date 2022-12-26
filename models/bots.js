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
      // define association here
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
      server_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "bots",
    }
  );
  return bots;
};
