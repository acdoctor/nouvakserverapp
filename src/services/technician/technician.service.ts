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
