import { Request, Response } from "express";
import {
  createService,
  findDuplicateService,
  findServiceById,
  findServiceByNameAndCategory,
  updateServiceById,
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

export const editService = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { serviceId } = req.params;
    const { name, description, terms, banner_images, icon, category, key } =
      req.body;

    // Validate banner_images array
    if (banner_images && !Array.isArray(banner_images)) {
      return res.status(400).json({
        success: false,
        message: "banner_images must be an array of objects.",
      });
    }

    // Check if serviceId is present and a string
    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Service ID is required and must be a string.",
      });
    }

    // Check if service exists
    const service = await findServiceById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Check for duplicate name + category (excluding same id)
    const existingService = await findDuplicateService(
      serviceId,
      name,
      category,
    );
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: `Another service with the name '${name}' already exists in the '${category}' category.`,
      });
    }

    // Update service
    const updatedService = await updateServiceById(serviceId, {
      name,
      description,
      terms,
      key,
      icon: icon || service.icon,
      banner_images: banner_images || service.banner_images,
      category,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error: unknown) {
    console.error("Error updating service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (error as Error).message,
    });
  }
};
