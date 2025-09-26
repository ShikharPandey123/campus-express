import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Warehouse from "@/models/Warehouse";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...warehouse.toObject(),
    capacityUsage: (warehouse.currentCapacity / warehouse.capacity) * 100,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = await params;
    const warehouse = await Warehouse.findByIdAndUpdate(id, body, { new: true });
    if (!warehouse) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...warehouse.toObject(),
      capacityUsage: (warehouse.currentCapacity / warehouse.capacity) * 100,
    });
  } catch{
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
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
    await Warehouse.findByIdAndDelete(id);
    return NextResponse.json({ message: "Warehouse deleted" });
  } catch{
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 });
  }
}
