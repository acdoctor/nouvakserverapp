import { Request, Response } from "express";
import {
  createLeadService,
  getUserLeadDetailsService,
} from "../../services/leads/leads.service";

export const createLead = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { place, quantity, userId, comment } = req.body as unknown as {
      place: string;
      quantity: number;
      userId: string;
      comment?: string;
    };

    await createLeadService(place, quantity, userId, comment);

    return res.status(201).json({
      status: true,
      message: "Lead created successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;

    return res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const getUserLeadDetails = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;

    if (!leadId || leadId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Lead id is required",
        data: {},
      });
    }

    const leadDetails = await getUserLeadDetailsService(leadId);

    if (!leadDetails) {
      return res.status(200).json({
        success: false,
        message: "Lead not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      data: leadDetails,
    });
  } catch (error: unknown) {
    console.error("Error finding lead:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong on the server",
    });
  }
};
