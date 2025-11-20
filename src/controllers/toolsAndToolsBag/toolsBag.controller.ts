import { Request, Response } from "express";
import { addToolBagService } from "../../services/toolsAndToolBag/toolsBag.service";
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
