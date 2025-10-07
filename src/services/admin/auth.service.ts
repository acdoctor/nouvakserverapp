import Admin from "../../models/admin/admin.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export interface JwtPayload {
  id: string;
  role: "admin" | "user" | "technician";
  iat?: number;
  exp?: number;
}

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token required");

  let payload: JwtPayload | null = null;
  let admin;

  try {
    // Decode and verify token
    payload = verifyRefreshToken(refreshToken) as JwtPayload;
  } catch {
    // Try to find user by token and clear invalid one
    admin = await Admin.findOne({ refreshToken });
    if (admin) {
      admin.refreshToken = undefined;
      await admin.save();
    }

    // Rethrow error so controller clears cookie
    throw new Error("Invalid or expired refresh token");
  }

  // Check if user exists and token matches
  admin = await Admin.findById(payload.id);
  if (!admin) throw new Error("User not found");

  if (admin.refreshToken !== refreshToken) {
    admin.refreshToken = undefined;
    await admin.save();
    throw new Error("Invalid refresh token");
  }

  // Rotate tokens (issue new ones)
  const newAccessToken = generateAccessToken({
    id: admin._id,
    role: admin.role,
  });

  const newRefreshToken = generateRefreshToken({
    id: admin._id,
    role: admin.role,
  });

  admin.refreshToken = newRefreshToken;
  await admin.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
