module.exports = function (sequelize, DataTypes) {
  const Reading = sequelize.define(
    "Reading",
    {
      voltage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "readings",
      timestamps: false,
    },
  );

  return Reading;
};
