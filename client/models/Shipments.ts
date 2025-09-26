import mongoose, { Schema, Document } from "mongoose";

export interface IShipment extends Document {
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  status: "Pending" | "PickedUp" | "InTransit" | "OutForDelivery" | "Delivered" | "Delayed";
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "PickedUp", "InTransit", "OutForDelivery", "Delivered", "Delayed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shipment || mongoose.model<IShipment>("Shipment", ShipmentSchema);
