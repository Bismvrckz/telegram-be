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
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_message_id: {
        type: DataTypes.BIGINT,
      },
      messageType: {
        type: DataTypes.ENUM("Image", "Message", "Document"),
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_bot: {
        type: DataTypes.BOOLEAN,
      },
      text: {
        type: DataTypes.STRING,
      },
      forwarding_status: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "messages",
      paranoid: true,
    }
  );
  return messages;
};
