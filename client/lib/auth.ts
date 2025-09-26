import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("Please define JWT_SECRET");

export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
  role: "Admin" | "Manager" | "WarehouseStaff";
}

export async function verifyAuth(req: NextRequest): Promise<AuthPayload | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch{
    return null;
  }
}

export function authorize(user: AuthPayload | null, allowedRoles: AuthPayload["role"][]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
