import { Request, Response } from "express";
import {
  addToolBagService,
  getToolBagListService,
} from "../../services/toolsAndToolBag/toolsBag.service";
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

export const getToolBagList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string)?.trim() || "";

    const { toolBags, total } = await getToolBagListService(
      page,
      limit,
      search,
    );

    return res.status(200).json({
      success: true,
      message: "ToolBag list fetched successfully",
      data: toolBags,
      count: total,
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
