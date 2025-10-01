import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOtp extends Document {
  adminId: Types.ObjectId;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // auto-delete after 5 min
});

export default mongoose.model<IOtp>("Otp", OtpSchema);
