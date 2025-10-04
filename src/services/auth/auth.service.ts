import Admin from "../../models/admin/admin.model";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";

export interface JwtPayload {
  id: string; // MongoDB _id
  role: "admin" | "user" | "technician";
  iat?: number; // issued at (optional, auto-added by JWT)
  exp?: number; // expiry time (optional)
}

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const payload = verifyRefreshToken(refreshToken) as JwtPayload;

  const admin = await Admin.findById(payload.id);
  if (!admin || admin.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    id: admin._id,
    role: admin.role,
  });
  return newAccessToken;
};
