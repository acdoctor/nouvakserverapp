import { Request, Response } from "express";
import * as technicianService from "../../services/technician/technician.service";

export const registerTechnician = async (req: Request, res: Response) => {
  try {
    await technicianService.createTechnician(req.body);

    return res.status(201).json({
      success: true,
      message: "Technician created successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: String(error),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const technician = await technicianService.loginTechnician(
      countryCode,
      phoneNumber,
    );

    res.json({
      success: true,
      message: "OTP sent for login",
      technicianId: Object(technician._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
