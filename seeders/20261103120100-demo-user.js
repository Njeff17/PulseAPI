const bcrypt = require("bcryptjs");

module.exports = {
  up: async function (queryInterface) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("users", [
      {
        email: "technician@pulseapi.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async function (queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: "technician@pulseapi.com",
    });
  },
};
