import { Request, Response } from "express";
import * as toolsAndToolBagService from "../../services/toolsAndToolBag/toolsAndToolbag.service";

export const addTool = async (req: Request, res: Response) => {
  try {
    const tool = req.body;

    // Validate input
    if (!tool.name?.trim() || !tool.description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Create tool using service
    const createdTool = await toolsAndToolBagService.addToolService(tool);

    return res.status(201).json({
      success: true,
      message: "Tool created successfully",
      data: createdTool, // return the saved document
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }

    // fallback
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: String(error),
    });
  }
};

export const updateTool = async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const { name, description, image } = req.body;

    if (!toolId) {
      return res.status(400).json({
        success: false,
        message: "Tool ID is required",
      });
    }

    const updatedTool = await toolsAndToolBagService.updateToolService({
      toolId,
      name,
      description,
      image,
    });

    if (!updatedTool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tool updated successfully",
      data: updatedTool,
    });
  } catch (error) {
    if (error instanceof Error) {
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
