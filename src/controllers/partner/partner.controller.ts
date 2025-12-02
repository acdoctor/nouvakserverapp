import { Request, Response } from "express";
import { addEditPartnerService } from "../../services/partner/partner.service";

export const addEditPartner = async (req: Request, res: Response) => {
  try {
    const partnerId = req.params.partnerId;
    const body: unknown = req.body;

    const { name, partnerLogo } = body as {
      name: string;
      partnerLogo: string;
    };

    if (!name || !partnerLogo) {
      return res.status(400).json({
        success: false,
        message: "Name and partnerLogo are required",
      });
    }

    const result = await addEditPartnerService({
      name,
      partnerId: partnerId ?? "",
      partnerLogo,
    });

    if (!partnerId) {
      return res.status(201).json({
        success: true,
        message: "Partner added successfully",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Partner updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Internal server error",
    });
  }
};
