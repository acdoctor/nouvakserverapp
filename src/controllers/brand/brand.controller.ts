import { Request, Response } from "express";
import { adminCreateEditBrandService } from "../../services/brand/brand.service";
import { AdminCreateEditBrandPayload } from "../../services/brand/brand.service";

export const adminCreateEditBrand = async (req: Request, res: Response) => {
  try {
    const payload = req.body as AdminCreateEditBrandPayload;

    const result = await adminCreateEditBrandService(payload);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "SERVER_ERROR";

    let message = "Something went wrong";

    switch (err) {
      case "BRAND_NAME_REQUIRED":
        message = "Brand name must be provided";
        break;
      case "INVALID_BRAND_ID":
        message = "Invalid brandId";
        break;
      case "BRAND_NAME_EXISTS":
        message = "Brand name already exists";
        break;
      case "BRAND_ALREADY_EXISTS":
        message = "Brand already exists";
        break;
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
