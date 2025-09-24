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
    const item = await InventoryItem.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch{
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
