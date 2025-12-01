import { Schema, model, Document } from "mongoose";

export interface IHomeBanner extends Document {
  imageUrl: string;
  position: number;
  destination: "COUPON" | "AD";
  data: string;
}

const HomeBannerSchema = new Schema<IHomeBanner>(
  {
    imageUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
      unique: true,
    },
    destination: {
      type: String,
      required: true,
      enum: ["COUPON", "AD"],
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const HomeBanner = model<IHomeBanner>("HomeBanner", HomeBannerSchema);
