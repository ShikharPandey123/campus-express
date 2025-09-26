import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  quantity: number;
  threshold: number;
  warehouse: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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

const InventoryItem: Model<IInventoryItem> =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
