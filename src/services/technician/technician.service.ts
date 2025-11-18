import { PipelineStage } from "mongoose";
import Technician, {
  ITechnician,
} from "../../models/technician/technician.model";
import * as technicianotpService from "../technician/otp.service";
import { Types } from "mongoose";
import { Booking } from "../../models/booking/booking.model";

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

export interface TechnicianBookingQuery extends TechnicianQuery {
  startDate?: string;
  endDate?: string;
}

interface TechnicianListResult {
  technicians: unknown[];
  totalTechnicians: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingListItem {
  _id: string;
  date: Date;
  status: string;
  slot: string;
  order_id: string;
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicianBookingListResult {
  bookings: BookingListItem[];
  total: number;
}

export interface BookingMatchCondition {
  assigned_to?: Types.ObjectId;
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
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
const VERIFIED = "VERIFIED";
const REJECTED = "REJECTED";
const AVAILABLE = "AVAILABLE";
const TBU = "TBU"; // To be uploaded
const SIGNED_UP = "SIGNED_UP";
const TBA = "TBA";
const DISABLED = "DISABLED";

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
    name: name,
    phoneNumber: phoneNumber,
    joiningDate: joiningDate || new Date(),
    position: position || TBA,
    type: type,
    countryCode: countryCode,
    profilePhoto: profilePhoto || "",
    status: SIGNED_UP,
    kycStatus: TBU,
    secondaryContactNumber: secondaryContactNumber || "",
    dob: dob || null,
    email: email || null,
    registred: false,
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
// export const getAllTechnicians = async () => {
//   const technicians = await Technician.find().lean();
//   return technicians;
// };

// Update technician by ID
// export const updateTechnicianById = async (
//   id: string,
//   updateData: Partial<TechnicianInput>,
// ) => {
//   const technician = await Technician.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
//   if (!technician) throw new Error("Technician not found");
//   return technician;
// };

export const editTechnicianService = async (
  technicianId: string,
  data: Partial<ITechnician>,
) => {
  // Validate ID inside service
  if (!technicianId) {
    return { success: false, code: 400, message: "Technician ID is required" };
  }

  // Check if technician exists
  const existingTechnician = await Technician.findById(technicianId);
  if (!existingTechnician) {
    return {
      success: false,
      code: 404,
      message: "Technician not found",
    };
  }

  // Build update data by preserving old values
  const updatedFields = {
    name: data.name ?? existingTechnician.name,
    joiningDate: data.joiningDate ?? existingTechnician.joiningDate,
    profilePhoto: data.profilePhoto ?? existingTechnician.profilePhoto,
    position: data.position ?? existingTechnician.position,
    type: data.type ?? existingTechnician.type,
    dob: data.dob ?? existingTechnician.dob,
    email: data.email ?? existingTechnician.email,
    secondaryContactNumber:
      data.secondaryContactNumber ?? existingTechnician.secondaryContactNumber,
  };

  await Technician.updateOne({ _id: technicianId }, updatedFields);

  return {
    success: true,
    code: 200,
    message: "Technician updated successfully",
  };
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
      updateData.kycStatus = REQUESTED;
      updateData.status = KYC_PENDING;
      break;

    case "APPROVE":
      updateData.kycStatus = VERIFIED;
      updateData.status = AVAILABLE;
      break;

    case "REJECT":
      updateData.kycStatus = REJECTED;
      updateData.status = KYC_PENDING;
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

export const toggleTechnicianStatusService = async (technicianId: string) => {
  const technician = await Technician.findById(technicianId);

  if (!technician) return null;

  let newStatus: string;

  if (technician.status === DISABLED) {
    newStatus = technician.kycStatus === VERIFIED ? AVAILABLE : KYC_PENDING;
  } else {
    newStatus = DISABLED;
  }

  const updatedTechnician = await Technician.findByIdAndUpdate(
    technicianId,
    { status: newStatus },
    { new: true },
  );

  return updatedTechnician;
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

export const getAvailableTechniciansService = async (
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const matchConditions = {
    position: { $ne: "HELPER" },
    status: "AVAILABLE",
    kycStatus: "VERIFIED",
  };

  const technicians = await Technician.find(matchConditions)
    .select("name phoneNumber _id status kycStatus position")
    .skip(offset)
    .limit(limit)
    .exec();

  const totalTechnicians = await Technician.countDocuments(matchConditions);

  return {
    technicians,
    totalTechnicians,
  };
};

export const technicianAssignedBookingListService = async (
  technicianId: string,
  query: TechnicianBookingQuery,
): Promise<TechnicianBookingListResult> => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const offset = (page - 1) * limit;

  const sortField = query.sortby || "createdAt";
  const sortOrder = query.orderby === "asc" ? 1 : -1;

  const startDate = query.startDate ? new Date(query.startDate) : null;
  const endDate = query.endDate ? new Date(query.endDate) : null;

  const matchConditions: BookingMatchCondition[] = [
    { assigned_to: new Types.ObjectId(technicianId) },
  ];

  if (startDate && endDate) {
    matchConditions.push({ date: { $gte: startDate, $lte: endDate } });
  } else if (startDate) {
    matchConditions.push({ date: { $gte: startDate } });
  } else if (endDate) {
    matchConditions.push({ date: { $lte: endDate } });
  }

  const pipeline: PipelineStage[] = [
    { $match: { $and: matchConditions } },
    {
      $project: {
        _id: 1,
        date: 1,
        status: 1,
        slot: 1,
        order_id: 1,
        bookingId: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: offset },
    { $limit: limit },
  ];

  const bookings = await Booking.aggregate(pipeline);

  const countResult = await Booking.aggregate([
    { $match: { assigned_to: new Types.ObjectId(technicianId) } },
    { $count: "total" },
  ]);

  const total = countResult.length ? countResult[0].total : 0;

  return { bookings, total };
};
