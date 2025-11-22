import { Request, Response } from "express";
import { createToolRequestService } from "../../services/toolsAndToolBag/toolsRequest.service";

export const createToolRequestController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      technicianId,
      identifier,
      name,
      type = "TOOL",
      quantity,
      comment = "",
      description = "",
      reason,
    } = req.body;

    const result = await createToolRequestService({
      technicianId,
      identifier,
      name,
      type,
      quantity,
      comment,
      description,
      reason,
    });

    return res.status(201).json({
      status: "success",
      message: "Tool request submitted successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Create Tool Request Error:", err);

    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: err.message,
    });
  }
};
