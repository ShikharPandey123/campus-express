import { Router } from "express";
import Shipment from "../../models/Shipment"; // assuming models live outside server
import mongoose from "mongoose";

const router = Router();

// Get all shipments
router.get("/", async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
});

// Create shipment
router.post("/", async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create shipment" });
  }
});

// Update shipment location (optional via API)
router.put("/:id/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { latitude, longitude } },
      { new: true }
    );
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

export default router;
