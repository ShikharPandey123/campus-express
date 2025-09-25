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

  let warehouses = await Warehouse.find({});
  
  if (warehouses.length === 0) {
    console.log("No warehouses found, creating sample warehouses...");
    const sampleWarehouses = [
      {
        name: "Main Warehouse",
        location: "Downtown",
        capacity: 10000,
        currentCapacity: 0
      },
      {
        name: "Secondary Warehouse", 
        location: "Industrial District",
        capacity: 5000,
        currentCapacity: 0
      }
    ];
    
    warehouses = await Warehouse.insertMany(sampleWarehouses);
    console.log("Created sample warehouses:", warehouses);
  }
  
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
