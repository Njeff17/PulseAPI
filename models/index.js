const { Sequelize, DataTypes } = require("sequelize");
const environment = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[environment];

const sequelize = new Sequelize(config);

const User = require("./user")(sequelize, DataTypes);
const Device = require("./device")(sequelize, DataTypes);
const Reading = require("./reading")(sequelize, DataTypes);
const Alert = require("./alert")(sequelize, DataTypes);

Device.hasMany(Reading, { foreignKey: "deviceId", onDelete: "CASCADE" });
Reading.belongsTo(Device, { foreignKey: "deviceId" });

Device.hasMany(Alert, { foreignKey: "deviceId", onDelete: "CASCADE" });
Alert.belongsTo(Device, { foreignKey: "deviceId" });

module.exports = { sequelize, User, Device, Reading, Alert };
