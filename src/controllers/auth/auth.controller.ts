import { Request, Response } from "express";
import * as authService from "../../services/auth/auth.service";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const newAccessToken = await authService.refreshAccessToken(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res
        .status(403)
        .json({ message: err.message || "Invalid or expired refresh token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
