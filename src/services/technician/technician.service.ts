import Technician from "../../models/technician/technician.model";

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
  const existingTechnician = await Technician.findOne({ phoneNumber });
  if (existingTechnician) {
    throw new Error("A technician with the given phone number already exists");
  }

  // Create technician
  await Technician.create({
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
};

export const loginTechnician = async (phoneNumber: string) => {
  const technician = await Technician.findOne({ phoneNumber });
  if (!technician) throw new Error("Technician not found");

  if (!technician.phoneNumber)
    throw new Error("Technician does not have a phone number");
  //   await technicianotpService.createOtp(String(technician._id), technician.phoneNumber);
  return technician;
};
