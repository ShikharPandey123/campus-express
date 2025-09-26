import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWarehouse extends Document {
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentCapacity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Warehouse: Model<IWarehouse> =
  mongoose.models.Warehouse ||
  mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);

export default Warehouse;
