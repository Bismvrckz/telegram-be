"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.messages, {
        foreignKey: "user_id",
      });
    }
  }
  users.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      is_bot: {
        type: DataTypes.BOOLEAN,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
