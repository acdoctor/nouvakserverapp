import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

// Generate short-lived access token (15 min)
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

// Generate long-lived refresh token (30 days)
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// Verify tokens
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
