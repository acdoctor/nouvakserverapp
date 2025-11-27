import { Request, Response } from "express";
import { createLeadService } from "../../services/leads/leads.service";

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
