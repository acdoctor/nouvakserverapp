import { Request, Response } from "express";
import * as authService from "../../services/admin/auth.service";

export const refresh = async (req: Request, res: Response) => {
  try {
    // ✅ Read from cookies
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(403)
        .json({ message: err.message || "Invalid or expired refresh token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
