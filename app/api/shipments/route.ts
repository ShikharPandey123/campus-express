import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shipment from "@/models/Shipments";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shipments = await Shipment.find({});
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

    // Map frontend data to model schema
    const shipmentData: Record<string, string> = {
      sender: body.senderName || body.sender || '',
      receiver: body.recipientName || body.receiver || '',
      origin: body.senderAddress || body.origin || '',
      destination: body.recipientAddress || body.destination || '',
      status: mapStatusToModel(body.status) || "Pending"
    };

    // Validate required fields
    const requiredFields = ['sender', 'receiver', 'origin', 'destination'];
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
      // Check for Mongoose validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json({ 
          error: "Validation failed", 
          message: error.message
        }, { status: 400 });
      }
      
      // Check for Mongoose cast errors
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

// Helper function to map frontend status to model status
function mapStatusToModel(frontendStatus: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'in-transit': 'InTransit',
    'out-for-delivery': 'OutForDelivery',
    'delivered': 'Delivered'
  };
  
  return statusMap[frontendStatus] || 'Pending';
}
