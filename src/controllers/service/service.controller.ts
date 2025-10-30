import { Request, Response } from "express";
import {
  createService,
  findServiceByNameAndCategory,
} from "../../services/service/service.service";
import { ServiceCategory } from "../../models/service/service.model";
// import { STATUS, CODES, MESSAGES } from "../../constants";

export const addService = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description, terms, category, banner_images, icon, key } =
      req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required.",
      });
    }

    const existingService = await findServiceByNameAndCategory(name, category);

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: `Service with the name '${name}' already exists in the '${category}' category.`,
      });
    }

    await createService({
      name,
      icon,
      description: description || [],
      terms: terms || [],
      banner_images: banner_images || [],
      category: category as ServiceCategory,
      key,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
    });
  } catch (error: unknown) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (error as Error).message,
    });
  }
};
