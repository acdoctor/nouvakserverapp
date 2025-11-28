import { Request, Response } from "express";
import { createConsultancyService } from "../../services/consultancy/consultancy.service";

export const createConsultancy = async (req: Request, res: Response) => {
  try {
    const payload = {
      ...req.body,
      file: req.file, // Multer file
    };

    const result = await createConsultancyService(payload);

    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
