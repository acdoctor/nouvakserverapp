import { Request, Response } from "express";
import { addToolService } from "../../services/toolsAndToolBag/toolsAndToolbag.service";

export const addTool = async (req: Request, res: Response) => {
  try {
    const tool = await addToolService(req.body);

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
