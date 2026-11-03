module.exports = function (sequelize, DataTypes) {
  const Alert = sequelize.define(
    "Alert",
    {
      voltage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "alerts",
      timestamps: false,
    },
  );

  return Alert;
};
