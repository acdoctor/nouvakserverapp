import { PipelineStage } from "mongoose";
import Technician from "../../models/technician/technician.model";
import * as technicianotpService from "../technician/otp.service";
import { Types } from "mongoose";

interface TechnicianInput {
  name: string;
  phoneNumber: string;
  joiningDate?: Date;
  profilePhoto?: string;
  position: string;
  secondaryContactNumber?: string;
  countryCode: string;
  type: string;
  email?: string;
  dob?: Date;
}

export interface TechnicianQuery {
  page?: string;
  limit?: string;
  sortby?: string;
  orderby?: "asc" | "desc";
  search?: string;
  type?: string;
  position?: string;
  status?: string;
  kycStatus?: string;
}

interface TechnicianListResult {
  technicians: unknown[];
  totalTechnicians: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type KycAction = "REQUEST" | "APPROVE" | "REJECT";

interface UpdateKycStatusInput {
  technicianId: string;
  action: KycAction;
}

/** Match filter structure */
interface MatchConditions {
  $and?: Record<string, unknown>[];
}

const KYC_PENDING = "KYC_PENDING";
const REQUESTED = "REQUESTED";

export const createTechnician = async (data: TechnicianInput) => {
  const {
    name,
    phoneNumber,
    joiningDate,
    profilePhoto,
    position,
    secondaryContactNumber,
    countryCode,
    type,
    email,
    dob,
  } = data;

  // Check if technician already exists
  const existingTechnician = await Technician.findOne({
    countryCode,
    phoneNumber,
  });
  if (existingTechnician) {
    throw new Error("A technician with the given phone number already exists");
  }

  // Create technician
  const technician = await Technician.create({
    name,
    phoneNumber,
    joiningDate,
    position,
    type,
    countryCode,
    profilePhoto: profilePhoto || "",
    status: KYC_PENDING,
    kycStatus: REQUESTED,
    secondaryContactNumber: secondaryContactNumber || "",
    dob: dob || null,
    email: email || null,
  });

  return technician;
};

export const loginTechnician = async (
  countryCode: string,
  phoneNumber: string,
) => {
  const technician = await Technician.findOne({ countryCode, phoneNumber });
  if (!technician) throw new Error("Technician not found");

  if (!technician.phoneNumber)
    throw new Error("Technician does not have a phone number");

  // Send OTP
  const fullPhone = technician.countryCode?.startsWith("+")
    ? `${technician.countryCode}${technician.phoneNumber}`
    : `+${technician.countryCode}${technician.phoneNumber}`;

  await technicianotpService.createOtp(String(technician._id), fullPhone);
  return technician;
};

// Get technician by ID
export const getTechnicianById = async (id: string) => {
  const technician = await Technician.findById(id).lean();
  if (!technician) throw new Error("Technician not found");
  return technician;
};

// Get all technicians
export const getAllTechnicians = async () => {
  const technicians = await Technician.find().lean();
  return technicians;
};

// Update technician by ID
export const updateTechnicianById = async (
  id: string,
  updateData: Partial<TechnicianInput>,
) => {
  const technician = await Technician.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!technician) throw new Error("Technician not found");
  return technician;
};

// Delete technician by ID
export const deleteTechnicianById = async (id: string) => {
  const technician = await Technician.findByIdAndDelete(id);
  if (!technician) throw new Error("Technician not found or already deleted");
  return technician;
};

export const updateKycService = async (
  technicianId: string,
  type: string,
  docUrl: string,
  uploadedBy: "admin" | "technician",
): Promise<void> => {
  const comment =
    uploadedBy === "technician"
      ? "Uploaded by technician"
      : "Uploaded by admin";

  const technician = await Technician.findById(
    new Types.ObjectId(technicianId),
  );
  if (!technician) {
    throw new Error("Technician not found");
  }

  // Try updating existing KYC doc
  const updateResult = await Technician.updateOne(
    {
      _id: technicianId,
      "kycDocs.type": type.toUpperCase(),
    },
    {
      $set: {
        "kycDocs.$.url": docUrl,
        "kycDocs.$.comment": comment,
      },
    },
  );

  // If document type does not exist, push a new one
  if (updateResult.matchedCount === 0) {
    await Technician.updateOne(
      { _id: technicianId },
      {
        $push: {
          kycDocs: { type: type.toUpperCase(), url: docUrl, comment },
        },
      },
    );
  }
};

export const updateKycStatusService = async ({
  technicianId,
  action,
}: UpdateKycStatusInput) => {
  const technician = await Technician.findById(technicianId);

  if (!technician) {
    return {
      success: false,
      statusCode: 404,
      message: "Technician not found",
    };
  }

  // Prepare status update object
  const updateData = {
    kycStatus: technician.kycStatus,
    status: technician.status,
  };

  switch (action) {
    case "REQUEST":
      updateData.kycStatus = "REQUESTED";
      updateData.status = "KYC_PENDING";
      break;

    case "APPROVE":
      updateData.kycStatus = "VERIFIED";
      updateData.status = "AVAILABLE";
      break;

    case "REJECT":
      updateData.kycStatus = "REJECTED";
      updateData.status = "KYC_PENDING";
      break;
  }

  await Technician.findByIdAndUpdate(technicianId, updateData, { new: true });

  return {
    success: true,
    statusCode: 200,
    message: `Technician KYC ${action}ED successfully`,
    data: updateData,
  };
};

export const getTechnicianListService = async (
  query: TechnicianQuery,
): Promise<TechnicianListResult> => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const offset = (page - 1) * limit;

  const sortField = query.sortby || "createdAt";
  const sortOrder = query.orderby === "asc" ? 1 : -1;

  const search = query.search || "";
  const type = query.type || "";
  const position = query.position || "";
  const status = query.status || "";
  const kycStatus = query.kycStatus || "";

  const matchConditions: MatchConditions = { $and: [] };

  if (search) {
    matchConditions.$and!.push({
      $or: [
        { phoneNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (type) matchConditions.$and!.push({ type });
  if (position) matchConditions.$and!.push({ position });
  if (status) matchConditions.$and!.push({ status });
  if (kycStatus) matchConditions.$and!.push({ kycStatus });

  if (matchConditions.$and!.length === 0) delete matchConditions.$and;

  const pipeline: PipelineStage[] = [
    { $match: matchConditions },
    {
      $project: {
        _id: 1,
        name: { $ifNull: ["$name", ""] },
        position: { $ifNull: ["$position", ""] },
        kycStatus: { $ifNull: ["$kycStatus", ""] },
        active: { $ifNull: ["$active", 0] },
        profilePhoto: { $ifNull: ["$profilePhoto", ""] },
        joiningDate: { $ifNull: ["$joiningDate", ""] },
        countryCode: { $ifNull: ["$countryCode", ""] },
        phoneNumber: { $ifNull: ["$phoneNumber", ""] },
        status: { $ifNull: ["$status", ""] },
        type: { $ifNull: ["$type", ""] },
        secondaryContactNumber: { $ifNull: ["$secondaryContactNumber", ""] },
        email: { $ifNull: ["$email", ""] },
        dob: { $ifNull: ["$dob", ""] },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: offset },
    { $limit: limit },
  ];

  const technicians = await Technician.aggregate(pipeline);

  const totalTechnicians = await Technician.countDocuments(matchConditions);

  return {
    technicians,
    totalTechnicians,
    page,
    limit,
    totalPages: Math.ceil(totalTechnicians / limit),
  };
};
