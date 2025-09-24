import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Warehouse from "@/models/Warehouse";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warehouse = await Warehouse.findById(params.id);
  if (!warehouse) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...warehouse.toObject(),
    capacityUsage: (warehouse.currentCapacity / warehouse.capacity) * 100,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const warehouse = await Warehouse.findByIdAndUpdate(params.id, body, { new: true });
    if (!warehouse) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...warehouse.toObject(),
      capacityUsage: (warehouse.currentCapacity / warehouse.capacity) * 100,
    });
  } catch{
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await Warehouse.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Warehouse deleted" });
  } catch{
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 });
  }
}
