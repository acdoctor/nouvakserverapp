import { Request, Response } from "express";
import * as authService from "../../services/admin/auth.service";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.json(tokens);
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
