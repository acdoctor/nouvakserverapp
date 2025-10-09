import mongoose, { Document, Schema } from "mongoose";

export interface IKycDoc {
  type:
    | "PAN"
    | "AADHAR_FRONT"
    | "AADHAR_BACK"
    | "DRIVING_LICENSE"
    | "VOTER_ID"
    | "PASSPORT";
  url?: string;
  comment?: string;
}

export interface ITechnician extends Document {
  name: string;
  joiningDate?: Date;
  type: "ACD" | "FC";
  position?:
    | "TBA"
    | "HELPER"
    | "TECHNICIAN"
    | "SENIOR TECHNICIAN"
    | "SUPERVISOR"
    | "MANAGER";
  kycStatus:
    | "TBU"
    | "PENDING"
    | "REVIEW_REQUESTED"
    | "IN_REVIEW"
    | "VERIFIED"
    | "REJECTED"
    | "REQUESTED";
  kycDocs?: IKycDoc[];
  profilePhoto?: string;
  countryCode: string;
  phoneNumber: string;
  status:
    | "SIGNED_UP"
    | "PROFILE_CREATED"
    | "KYC_PENDING"
    | "ON_BOARDING"
    | "ON_JOB"
    | "AVAILABLE"
    | "ON_LEAVE"
    | "ON_BREAK"
    | "ON_TRAINING"
    | "DISABLED"
    | "TERMINATED"
    | "RESIGNED";
  email?: string | null;
  dob?: Date | null;
  secondaryContactNumber?: string;
  registered?: boolean;
  totalLeaves?: number;
  refreshToken?: string | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}

const technicianSchema = new Schema<ITechnician>(
  {
    name: { type: String, required: true },
    joiningDate: { type: Date },
    type: { type: String, enum: ["ACD", "FC"], required: true },
    position: {
      type: String,
      enum: [
        "TBA",
        "HELPER",
        "TECHNICIAN",
        "SENIOR TECHNICIAN",
        "SUPERVISOR",
        "MANAGER",
      ],
      default: "TBA",
    },
    kycStatus: {
      type: String,
      enum: [
        "TBU",
        "PENDING",
        "REVIEW_REQUESTED",
        "IN_REVIEW",
        "VERIFIED",
        "REJECTED",
        "REQUESTED",
      ],
      default: "PENDING",
      required: true,
    },
    kycDocs: [
      {
        type: {
          type: String,
          enum: [
            "PAN",
            "AADHAR_FRONT",
            "AADHAR_BACK",
            "DRIVING_LICENSE",
            "VOTER_ID",
            "PASSPORT",
          ],
        },
        url: String,
        comment: String,
      },
    ],
    profilePhoto: { type: String, default: "" },
    countryCode: { type: String, default: "+91", required: true },
    phoneNumber: { type: String, unique: true, index: true, length: 10 },
    status: {
      type: String,
      enum: [
        "SIGNED_UP",
        "PROFILE_CREATED",
        "KYC_PENDING",
        "ON_BOARDING",
        "ON_JOB",
        "AVAILABLE",
        "ON_LEAVE",
        "ON_BREAK",
        "ON_TRAINING",
        "DISABLED",
        "TERMINATED",
        "RESIGNED",
      ],
      default: "AVAILABLE",
      required: true,
    },
    email: { type: String, default: null },
    dob: { type: Date, default: null },
    secondaryContactNumber: { type: String, default: "" },
    registered: { type: Boolean, default: false },
    totalLeaves: { type: Number, default: 0 },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

const Technician = mongoose.model<ITechnician>("Technician", technicianSchema);
export default Technician;
