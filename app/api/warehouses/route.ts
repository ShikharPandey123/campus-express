import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Warehouse from "@/models/Warehouse";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warehouses = await Warehouse.find({});
  return NextResponse.json(
    warehouses.map((wh) => ({
      ...wh.toObject(),
      capacityUsage: (wh.currentCapacity / wh.capacity) * 100, // percentage usage
    }))
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const warehouse = await Warehouse.create(body);
    return NextResponse.json(warehouse, { status: 201 });
  } catch{
    return NextResponse.json({ error: "Failed to add warehouse" }, { status: 500 });
  }
}
