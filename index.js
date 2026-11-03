const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env");
  process.exit(1);
}

app.use(express.json());
app.use(authRoutes);

app.listen(PORT, function () {
  console.log("PulseAPI is running at http://localhost:" + PORT);
});
