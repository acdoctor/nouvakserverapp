import { Request, Response } from "express";
import { addToolBagService } from "../../services/toolsAndToolBag/toolsBag.service";
import {
  updateToolBagService,
  ToolBagPayload,
} from "../../services/toolsAndToolBag/toolsBag.service";
export const addToolBag = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const newToolBag = await addToolBagService(payload);

    return res.status(201).json({
      success: true,
      message: "Tool bag created successfully",
      data: newToolBag,
    });
  } catch (error: unknown) {
    const err = error as Error;

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateToolBag = async (req: Request, res: Response) => {
  try {
    const { toolsBagId } = req.params;
    const updateData: Partial<ToolBagPayload> = req.body;

    if (!toolsBagId) {
      return res.status(400).json({
        success: false,
        message: "tools bag ID is required",
      });
    }

    const toolBag = await updateToolBagService(toolsBagId, updateData);

    return res.status(200).json({
      success: true,
      message: "ToolBag updated successfully",
      data: toolBag,
    });
  } catch (error: unknown) {
    const err = error as Error;

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
