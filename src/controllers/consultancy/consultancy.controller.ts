import { Request, Response } from "express";
import {
  createConsultancyService,
  getConsultancyDetailsService,
} from "../../services/consultancy/consultancy.service";

export const createConsultancy = async (req: Request, res: Response) => {
  try {
    const payload = {
      ...req.body,
      file: req.file, // Multer file
    };

    const result = await createConsultancyService(payload);

    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const userConsultancyDetails = async (req: Request, res: Response) => {
  try {
    const { consultancyId } = req.params;

    if (!consultancyId) {
      return res.status(400).json({
        success: false,
        message: "consultancyId is required",
      });
    }

    const consultancy = await getConsultancyDetailsService(consultancyId);

    if (!consultancy) {
      return res.status(404).json({
        success: false,
        message: "Consultancy not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: consultancy._id,
        userId: consultancy.user_id,
        brand: consultancy.brandId, // populated brand { _id, name }
        quantity: consultancy.quantity,
        comment: consultancy.comment,
        place: consultancy.place,
        consultancyId: consultancy.consultancyId,
        serviceName: consultancy.serviceName,
        addressDetails: consultancy.addressDetails,
        slot: consultancy.slot,
        date: consultancy.date,
        status: consultancy.status,
        documentURL: consultancy.documentURL,
        alternatePhone: consultancy.alternatePhone,
        createdAt: consultancy.createdAt,
        updatedAt: consultancy.updatedAt,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INVALID_ID") {
      return res.status(400).json({
        success: false,
        message: "Invalid consultancyId format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
