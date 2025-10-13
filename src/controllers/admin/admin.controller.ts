import * as adminService from "../../services/admin/admin.service";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const admin = await adminService.createAdmin(phoneNumber);

    res.status(201).json({
      message: "OTP sent for verification",
      userId: Object(admin._id),
    });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const admin = await adminService.loginAdmin(phoneNumber);

    res.json({ message: "OTP sent for login", userId: Object(admin._id) });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};
