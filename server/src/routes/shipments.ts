import { Router } from "express";
import Shipment from "@shared/models/Shipment";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create shipment" });
  }
});

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
