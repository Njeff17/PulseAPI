const express = require("express");
const requireAuth = require("./middleware/requireAuth");
const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/devices");

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env");
  process.exit(1);
}

app.use(express.json());
app.use(authRoutes);
app.use("/api/devices", requireAuth, deviceRoutes);

app.listen(PORT, function () {
  console.log("PulseAPI is running at http://localhost:" + PORT);
});
