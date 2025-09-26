import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import InventoryItem from "@/models/InventoryItem";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await InventoryItem.findById(id).populate("warehouse");
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...item.toObject(),
    lowStock: item.quantity < item.threshold,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = await params;
    const item = await InventoryItem.findByIdAndUpdate(id, body, { new: true }).populate("warehouse");
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...item.toObject(),
      lowStock: item.quantity < item.threshold,
    });
  } catch{
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await InventoryItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Item deleted" });
  } catch{
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
