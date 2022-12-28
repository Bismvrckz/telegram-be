"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_message_id: {
        type: Sequelize.BIGINT,
      },
      messageType: {
        type: Sequelize.ENUM("Image", "Message", "Document"),
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_bot: {
        type: Sequelize.BOOLEAN,
      },
      text: {
        type: Sequelize.STRING,
      },
      forwarding_status: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("messages");
  },
};
