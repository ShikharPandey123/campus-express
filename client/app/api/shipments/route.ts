import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shipment from "@shared/models/Shipment";
import Warehouse from "@shared/models/Warehouse";
import { verifyAuth, authorize } from "@/lib/auth";

// Function to get or create a default warehouse
async function getDefaultWarehouse() {
  let warehouse = await Warehouse.findOne({ name: "Default Warehouse" });
  
  if (!warehouse) {
    warehouse = await Warehouse.create({
      name: "Default Warehouse",
      location: "Main Distribution Center",
      capacity: 1000,
      currentCapacity: 0
    });
  }
  
  return warehouse._id;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shipments = await Shipment.find({}).populate('warehouse');
    
    // If no shipments exist, create some sample data
    if (shipments.length === 0) {
      const defaultWarehouseId = await getDefaultWarehouse();
      
      const sampleShipments = [
        {
          trackingId: "TRK001",
          description: "Electronics Package",
          currentLocation: "New York Distribution Center",
          weight: 2.5,
          dimensions: "30x20x15 cm",
          status: "in-transit",
          warehouse: defaultWarehouseId,
          senderName: "John Smith",
          senderContact: "+1-555-0101",
          senderAddress: "123 Main St, New York, NY 10001",
          recipientName: "Alice Johnson",
          recipientContact: "+1-555-0102",
          recipientAddress: "456 Oak Ave, Los Angeles, CA 90210",
          pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          isDelivered: false
        },
        {
          trackingId: "TRK002",
          description: "Clothing Package",
          currentLocation: "Chicago Sorting Facility",
          weight: 1.8,
          dimensions: "25x25x10 cm",
          status: "out-for-delivery",
          warehouse: defaultWarehouseId,
          senderName: "Maria Garcia",
          senderContact: "+1-555-0201",
          senderAddress: "789 Pine St, Miami, FL 33101",
          recipientName: "Bob Wilson",
          recipientContact: "+1-555-0202",
          recipientAddress: "321 Elm Dr, Seattle, WA 98101",
          pickupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          expectedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          isDelivered: false
        },
        {
          trackingId: "TRK003",
          description: "Books and Documents",
          currentLocation: "Denver Processing Center",
          weight: 3.2,
          dimensions: "35x25x20 cm",
          status: "pending",
          warehouse: defaultWarehouseId,
          senderName: "David Chen",
          senderContact: "+1-555-0301",
          senderAddress: "147 Cedar Ln, San Francisco, CA 94102",
          recipientName: "Sarah Davis",
          recipientContact: "+1-555-0302",
          recipientAddress: "852 Maple St, Chicago, IL 60601",
          pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isDelivered: false
        }
      ];
      
      try {
        const createdShipments = await Shipment.insertMany(sampleShipments);
        return NextResponse.json(createdShipments);
      } catch (createError) {
        console.log("Could not create sample shipments:", createError);
        return NextResponse.json([]);
      }
    }
    
    return NextResponse.json(shipments);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: "Internal server error",
        message: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Unknown server error"
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!authorize(user, ["Admin", "Manager"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Generate a unique tracking ID
    const trackingId = `TRK${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    // Get warehouse ID - use user's warehouse or default warehouse
    const warehouseId = body.warehouse || user?.warehouse || await getDefaultWarehouse();
    
    const shipmentData = {
      trackingId,
      description: body.description || 'Package shipment',
      currentLocation: body.currentLocation || body.senderAddress || '',
      weight: body.weight || 1,
      dimensions: body.dimensions || '10x10x10 cm',
      status: body.status || 'pending',
      warehouse: warehouseId,
      senderName: body.senderName || '',
      senderContact: body.senderContact || '',
      senderAddress: body.senderAddress || '',
      recipientName: body.recipientName || '',
      recipientContact: body.recipientContact || '',
      recipientAddress: body.recipientAddress || '',
      pickupDate: body.pickupDate ? new Date(body.pickupDate) : new Date(),
      expectedDate: body.expectedDate ? new Date(body.expectedDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
      isDelivered: body.status === 'delivered' || false
    };
    
    const requiredFields: (keyof typeof shipmentData)[] = ['senderName', 'recipientName', 'senderAddress', 'recipientAddress'];
    const missingFields = requiredFields.filter(field => !shipmentData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: "Missing required fields", 
        missingFields
      }, { status: 400 });
    }

    const shipment = await Shipment.create(shipmentData);
    return NextResponse.json(shipment, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({ 
          error: "Validation failed", 
          message: error.message
        }, { status: 400 });
      }
      if (error.name === 'CastError') {
        return NextResponse.json({ 
          error: "Invalid data format", 
          message: error.message
        }, { status: 400 });
      }

      return NextResponse.json({ 
        error: "Internal server error",
        message: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Unknown server error"
    }, { status: 500 });
  }
}
