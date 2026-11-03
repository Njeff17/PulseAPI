module.exports = function (sequelize, DataTypes) {
  const Device = sequelize.define(
    "Device",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "devices",
    },
  );

  return Device;
};
