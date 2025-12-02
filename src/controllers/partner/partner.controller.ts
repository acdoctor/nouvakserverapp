import { Request, Response } from "express";
import {
  addEditPartnerService,
  partnerListService,
} from "../../services/partner/partner.service";

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

export const partnerList = async (
  req: Request,
  res: Response,
): Promise<unknown> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const search = (req.query.search as string) || "";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // default asc

    const { partners, total } = await partnerListService({
      limit,
      page,
      search,
      sortOrder,
    });

    if (partners.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No data found",
        data: [],
        count: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: partners,
      count: total,
      pagination: {
        totalItems: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
