import Admin from "../../models/admin/admin.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export interface JwtPayload {
  id: string; // MongoDB _id
  role: "admin" | "user" | "technician";
  iat?: number; // issued at (optional, auto-added by JWT)
  exp?: number; // expiry time (optional)
}

/**
 * Refresh access token
 * @param refreshToken - Refresh token from client
 * @returns Object with new accessToken and refreshToken
 */
export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token required");

  // Verify the refresh token
  const payload = verifyRefreshToken(refreshToken) as JwtPayload;

  // Find admin in DB
  const admin = await Admin.findById(payload.id);
  if (!admin || admin.refreshToken !== refreshToken) {
    // If token invalid, remove refresh token from DB (cleanup)
    if (admin) {
      admin.refreshToken = undefined;
      await admin.save();
    }
    throw new Error("Invalid refresh token");
  }

  // Optional: Check expiry manually (jwt.verify usually handles this)
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    admin.refreshToken = undefined;
    await admin.save();
    throw new Error("Refresh token expired");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    id: admin._id,
    role: admin.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: admin._id,
    role: admin.role,
  });

  // Save new refresh token to DB (rotation)
  admin.refreshToken = newRefreshToken;
  await admin.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
