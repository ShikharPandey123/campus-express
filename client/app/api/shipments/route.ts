import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shipment from "@shared/models/Shipment";
import { verifyAuth, authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!authorize(user, ["Admin", "Manager", "WarehouseStaff"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shipments = await Shipment.find({});
    
    // If no shipments exist, return sample data for demonstration
    if (shipments.length === 0) {
      const sampleShipments = [
        {
          _id: "sample001",
          sender: "John Smith",
          receiver: "Alice Johnson",
          origin: "New York, NY",
          destination: "Los Angeles, CA",
          status: "InTransit",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample002",
          sender: "Maria Garcia",
          receiver: "Bob Wilson",
          origin: "Miami, FL",
          destination: "Seattle, WA",
          status: "OutForDelivery",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample003",
          sender: "David Chen",
          receiver: "Sarah Davis",
          origin: "San Francisco, CA",
          destination: "Chicago, IL",
          status: "Pending",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample004",
          sender: "Emma Brown",
          receiver: "Michael Taylor",
          origin: "Boston, MA",
          destination: "Denver, CO",
          status: "Delivered",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString() // Delivered today
        },
        {
          _id: "sample005",
          sender: "James Miller",
          receiver: "Lisa Anderson",
          origin: "Houston, TX",
          destination: "Phoenix, AZ",
          status: "PickedUp",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample006",
          sender: "Ryan Clark",
          receiver: "Jennifer Lee",
          origin: "Portland, OR",
          destination: "Atlanta, GA",
          status: "InTransit",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample007",
          sender: "Sophie Turner",
          receiver: "Kevin White",
          origin: "Las Vegas, NV",
          destination: "Orlando, FL",
          status: "Delayed",
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: "sample008",
          sender: "Alex Rodriguez",
          receiver: "Grace Kim",
          origin: "Philadelphia, PA",
          destination: "San Diego, CA",
          status: "OutForDelivery",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      return NextResponse.json(sampleShipments);
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
