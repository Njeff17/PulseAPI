module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable("alerts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "devices", key: "id" },
        onDelete: "CASCADE",
      },
      voltage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async function (queryInterface) {
    await queryInterface.dropTable("alerts");
  },
};
