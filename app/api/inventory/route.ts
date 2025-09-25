import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import InventoryItem from "@/models/InventoryItem";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await InventoryItem.find({}).populate("warehouse");

  const itemsWithAlert = items.map((item) => ({
    ...item.toObject(),
    lowStock: item.quantity < item.threshold,
  }));

  return NextResponse.json(itemsWithAlert);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    console.log("Received inventory item data:", body);
    
    // Validate that warehouse exists before creating the item
    if (!body.warehouse) {
      return NextResponse.json({ error: "Warehouse is required" }, { status: 400 });
    }
    
    const item = await InventoryItem.create(body);
    console.log("Created inventory item:", item);
    
    const populatedItem = await InventoryItem.findById(item._id).populate("warehouse");
    return NextResponse.json(populatedItem, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating inventory item:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to add item";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
