import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shipment from "@/models/Shipments";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const user = await verifyAuth(req);

  if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const shipment = await Shipment.findById(id);
  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(shipment);
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
    const shipment = await Shipment.findByIdAndUpdate(id, body, { new: true });
    if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(shipment);
  } catch{
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 });
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
    await Shipment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Shipment deleted" });
  } catch{
    return NextResponse.json({ error: "Failed to delete shipment" }, { status: 500 });
  }
}
