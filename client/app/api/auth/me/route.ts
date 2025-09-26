import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@shared/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET");
}
interface MyJwtPayload extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded: MyJwtPayload | string;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    } catch{
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (typeof decoded === "string" || !decoded?.id) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me route error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
