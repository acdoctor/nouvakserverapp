import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  phone?: string;
  type?: number;
  role?: string;
  refreshToken?: string | undefined;
  status?: "pending" | "active" | "blocked";
  createdAt?: Date;
  _id: mongoose.Types.ObjectId;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
    },
    role: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

// module.exports = Admin;
export default Admin;
