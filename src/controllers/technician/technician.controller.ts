import { Request, Response } from "express";
import * as technicianService from "../../services/technician/technician.service";
import { ITechnician } from "../../models/technician/technician.model";
import mongoose from "mongoose";

export interface UpdateKycDTO {
  type:
    | "PAN"
    | "AADHAR_FRONT"
    | "AADHAR_BACK"
    | "DRIVING_LICENSE"
    | "VOTER_ID"
    | "PASSPORT";
  comment?: string;
  docUrl: string;
}

export const registerTechnician = async (req: Request, res: Response) => {
  try {
    await technicianService.createTechnician(req.body);

    return res.status(201).json({
      success: true,
      message: "Technician created successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (
      message.includes(
        "A technician with the given phone number already exists",
      )
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    console.error("Error creating technician:", message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: message,
    });
  }
};

export const loginRegisterTechnician = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;

    if (!countryCode || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Country code and phone number are required.",
      });
    }

    const technician: ITechnician | null =
      await technicianService.loginTechnician(countryCode, phoneNumber);

    if (!technician) {
      const newTechnician: ITechnician | null =
        await technicianService.createTechnician(req.body);

      return res.status(201).json({
        success: true,
        message:
          "Technician registered successfully. OTP sent for verification.",
        technicianId: newTechnician?._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent for login.",
      technicianId: technician._id,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getTechnicianById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Technician ID is required" });
    }

    const technician = await technicianService.getTechnicianById(id);
    res.status(200).json({
      success: true,
      data: technician,
      message: "Technician fetched successfully",
    });
  } catch (err: unknown) {
    res.status(404).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

// export const getAllTechnicians = async (_req: Request, res: Response) => {
//   try {
//     const technicians = await technicianService.getAllTechnicians();
//     res.json({ success: true, data: technicians });
//   } catch (err: unknown) {
//     res.status(500).json({
//       success: false,
//       error: err instanceof Error ? err.message : String(err),
//     });
//   }
// };

export const updateTechnician = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Technician ID is required" });
    }

    const updatedTechnician = await technicianService.updateTechnicianById(
      id,
      req.body,
    );
    res.json({
      success: true,
      message: "Technician updated successfully",
      data: updatedTechnician,
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const deleteTechnician = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Technician ID is required" });
    }

    await technicianService.deleteTechnicianById(id);
    res.json({ success: true, message: "Technician deleted successfully" });
  } catch (err: unknown) {
    res.status(404).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const updateKyc = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const technicianId =
      (req as { technicianId?: string }).technicianId ||
      req.params.technicianId;
    const { type, docUrl } = req.body as UpdateKycDTO;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }

    const uploadedBy = (req as { technicianId?: string }).technicianId
      ? "technician"
      : "admin";

    await technicianService.updateKycService(
      technicianId,
      type,
      docUrl,
      uploadedBy,
    );

    return res.status(200).json({
      success: true,
      message: "Technician KYC updated successfully",
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Technician not found") {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        (err instanceof Error && err.message) ||
        "falseed to update technician KYC",
    });
  }
};

export const updateKycStatus = async (req: Request, res: Response) => {
  const { technicianId, action } = req.body;

  try {
    const result = await technicianService.updateKycStatusService({
      technicianId,
      action: action.toUpperCase(),
    });

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data || null,
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

export const toggleTechnicianStatus = async (req: Request, res: Response) => {
  const { technicianId } = req.params as { technicianId: string };

  try {
    const updatedTechnician =
      await technicianService.toggleTechnicianStatusService(technicianId);

    if (!updatedTechnician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Technician status updated to ${updatedTechnician.status}`,
      data: updatedTechnician,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: errMsg,
      data: null,
    });
  }
};

export const technicianList = async (req: Request, res: Response) => {
  try {
    const result = await technicianService.getTechnicianListService(req.query);

    if (result.technicians.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.technicians,
        count: result.totalTechnicians,
        pagination: {
          total: result.totalTechnicians,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    }

    return res.status(200).json({
      success: false,
      message: "No technicians found",
      data: [],
      count: 0,
    });
  } catch (error) {
    const err = error as Error;

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAvailableTechnicians = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { technicians, totalTechnicians } =
      await technicianService.getAvailableTechniciansService(page, limit);

    return res.status(200).json({
      success: true,
      message: "Available technicians fetched successfully",
      data: technicians,
      count: totalTechnicians,
      pagination: {
        totalTechnicians,
        page,
        limit,
        totalPages: Math.ceil(totalTechnicians / limit),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: errorMessage,
      data: null,
    });
  }
};

export const technicianAssignedBookingList = async (
  req: Request,
  res: Response,
) => {
  const { technicianId } = req.params;

  if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId)) {
    return res.status(400).json({
      success: false,
      message: "Valid technician ID is required",
    });
  }

  try {
    const result = await technicianService.technicianAssignedBookingListService(
      technicianId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result.bookings,
      total: result.total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (err as Error).message,
    });
  }
};
