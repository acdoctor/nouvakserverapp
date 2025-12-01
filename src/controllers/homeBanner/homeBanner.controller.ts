// controllers/homeBanner/homeBanner.controller.ts

import { Request, Response } from "express";
import {
  editHomeBannerService,
  saveHomeBannerService,
} from "../../services/homeBanner/homeBanner.service";

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

export const editHomeBanner = async (req: Request, res: Response) => {
  try {
    const homeBannerId = req.params.homeBannerId;
    const { imageUrl, destination, position, data } = req.body;

    // Basic validation to ensure required fields are provided (narrows types to string)
    if (!homeBannerId || !imageUrl || !destination || !position) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const updatedHomeBanner = await editHomeBannerService(homeBannerId, {
      imageUrl,
      destination,
      position,
      data,
    });

    if (!updatedHomeBanner) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Home banner updated successfully",
      data: updatedHomeBanner,
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
};
