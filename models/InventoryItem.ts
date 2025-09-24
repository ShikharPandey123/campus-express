import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  quantity: number;
  threshold: number; // alert if quantity < threshold
  warehouse: mongoose.Types.ObjectId;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    threshold: { type: Number, required: true, default: 10 },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
