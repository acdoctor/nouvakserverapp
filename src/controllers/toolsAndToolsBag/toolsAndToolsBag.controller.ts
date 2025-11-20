import { Request, Response } from "express";
import { addToolService } from "../../services/toolsAndToolBag/toolsAndToolbag.service";

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
    const createdTool = await addToolService(tool);

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
