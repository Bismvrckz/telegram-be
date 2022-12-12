"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      messages.belongsTo(models.users, {
        foreignKey: "user_id",
      });
    }
  }
  messages.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      message_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      is_bot: {
        type: DataTypes.BOOLEAN,
      },
      text: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "messages",
    }
  );
  return messages;
};
