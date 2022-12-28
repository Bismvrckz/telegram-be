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
      users.belongsTo(models.bots, {
        foreignKey: "bot_token",
      });
    }
  }
  users.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      chat_id: {
        type: DataTypes.STRING,
      },
      bot_token: {
        type: DataTypes.STRING,
        references: {
          model: "bots",
          key: "bot_token",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      paranoid: true,
    }
  );
  return users;
};
