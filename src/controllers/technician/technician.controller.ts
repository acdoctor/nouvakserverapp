import { Request, Response } from "express";
import * as technicianService from "../../services/technician/technician.service";

export const createTechnician = async (req: Request, res: Response) => {
  try {
    await technicianService.createTechnician(req.body);

    return res.status(201).json({
      message: "Technician created successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: String(error),
    });
  }
};
