import Admin from "../../models/admin/admin.model";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";

export interface JwtPayload {
  id: string;
  role: "admin" | "user" | "technician";
  iat?: number;
  exp?: number;
}

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const payload = verifyRefreshToken(refreshToken) as JwtPayload;

  const admin = await Admin.findById(payload.id);
  if (!admin) throw new Error("User not found");

  // Check if token matches saved one
  if (admin.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    admin.refreshToken = undefined;
    await admin.save();
    throw new Error("Refresh token expired");
  }

  const newAccessToken = generateAccessToken({
    id: admin._id,
    role: admin.role,
  });

  return newAccessToken;
};
