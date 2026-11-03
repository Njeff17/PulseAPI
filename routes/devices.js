const express = require("express");
const { Device } = require("../models");

const router = express.Router();

router.get("/", async function (req, res) {
  const devices = await Device.findAll();
  res.json(devices);
});

router.post("/", async function (req, res) {
  const name = req.body.name;
  const serialNumber = req.body.serialNumber;
  const location = req.body.location;

  if (!name || !serialNumber) {
    return res
      .status(400)
      .json({ error: "Name and serial number are required" });
  }

  const existingDevice = await Device.findOne({
    where: { serialNumber: serialNumber },
  });

  if (existingDevice) {
    return res.status(409).json({ error: "Serial number already exists" });
  }

  const device = await Device.create({
    name: name,
    serialNumber: serialNumber,
    location: location,
  });

  res.status(201).json(device);
});

module.exports = router;
