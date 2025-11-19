import { Request, Response } from "express";
import { addToolService } from "../../services/toolsAndToolBag/toolsAndToolbag.service";

export const addTool = async (req: Request, res: Response) => {
  try {
    const tool = req.body;

    // Validate input
    if (!tool.name || !tool.description) {
      return res.status(400).json({
        success: false,
        message: "name and desctiption is required",
      });
    }

    await addToolService(tool);

    return res.status(201).json({
      success: true,
      message: "Tool created successfully",
      data: tool,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }

    // fallback if error is not instance of Error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: String(error),
    });
  }
};
