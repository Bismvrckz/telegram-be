"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      user_id: {
        type: Sequelize.BIGINT,
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
