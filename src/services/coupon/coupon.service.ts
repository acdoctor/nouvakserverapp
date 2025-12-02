import Coupon, { ICoupon } from "../../models/coupon/coupon.model";
import { Types } from "mongoose";

export const createCouponService = async (payload: {
  couponCode: string | null;
  image?: string;
  name: string;
  discount: number;
  minValue: number;
  expiryDate: Date;
  description: string[];
}): Promise<ICoupon> => {
  const { couponCode } = payload;
  const existingCoupon = await Coupon.findOne({ couponCode });

  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  const newCoupon = await Coupon.create(payload);
  return newCoupon;
};

export const updateCouponService = async (
  couponId: string,
  payload: Partial<ICoupon>,
): Promise<ICoupon | null> => {
  if (!Types.ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon ID");
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, payload, {
    new: true,
  });

  return updatedCoupon;
};
