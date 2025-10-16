import * as adminService from "../../services/admin/admin.service";
import { Request, Response } from "express";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const admin = await adminService.createAdmin(countryCode, phoneNumber);

    res.status(201).json({
      success: true,
      message: "OTP sent for verification",
      adminId: Object(admin._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const admin = await adminService.loginAdmin(countryCode, phoneNumber);

    res.json({
      success: true,
      message: "OTP sent for login",
      adminId: Object(admin._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.fetchAdminById(req.params.id);
    res.json({ success: true, data: admin });
  } catch (err: unknown) {
    res
      .status(404)
      .json({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
  }
};
