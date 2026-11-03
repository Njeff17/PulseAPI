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

router.get("/:id", async function (req, res) {
  const device = await Device.findByPk(req.params.id);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  res.json(device);
});

router.patch("/:id", async function (req, res) {
  const device = await Device.findByPk(req.params.id);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  if (req.body.name !== undefined) {
    if (!req.body.name) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    device.name = req.body.name;
  }

  if (req.body.location !== undefined) {
    device.location = req.body.location;
  }

  await device.save();
  res.json(device);
});

router.delete("/:id", async function (req, res) {
  const device = await Device.findByPk(req.params.id);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  await device.destroy();
  res.status(204).send();
});

module.exports = router;
