import mongoose, { Schema, Document , Model } from "mongoose";

export interface IShipment extends Document {
  trackingId: string;
  description: string;
  currentLocation: string;
  weight: number;
  dimensions: string;
  status: "pending" | "in-transit" | "out-for-delivery" | "delivered";
  warehouse: mongoose.Types.ObjectId;
  senderName: string;
  senderContact: string;
  senderAddress: string;
  recipientName: string;
  recipientContact: string;
  recipientAddress: string;
  pickupDate: Date;
  expectedDate: Date;
  isDelivered: boolean;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    trackingId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    currentLocation: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-transit", "out-for-delivery", "delivered"],
      default: "pending",
    },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    senderName: { type: String, required: true },
    senderContact: { type: String, required: true },
    senderAddress: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientContact: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    expectedDate: { type: Date, required: true },
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Shipment: Model<IShipment> =
  mongoose.models.Shipment || mongoose.model<IShipment>("Shipment", ShipmentSchema);

export default Shipment;
