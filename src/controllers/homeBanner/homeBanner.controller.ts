// controllers/homeBanner/homeBanner.controller.ts

import { Request, Response } from "express";
import { saveHomeBannerService } from "../../services/homeBanner/homeBanner.service";

export const addHomeBanner = async (req: Request, res: Response) => {
  try {
    const { imageUrl, destination, position, data } = req.body;

    // Basic validation
    if (!imageUrl || !destination || !position) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const result = await saveHomeBannerService({
      imageUrl,
      destination,
      position,
      data,
    });

    return res.status(201).json({
      success: true,
      message: "Home banner saved successfully",
      data: result,
    });
  } catch (error: unknown) {
    // Safely extract error message
    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: errMsg,
    });
  }
};
