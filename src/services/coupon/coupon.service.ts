import Coupon, { ICoupon } from "../../models/coupon/coupon.model";
import { Types, SortOrder } from "mongoose";

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

export const couponListService = async (
  page: number,
  limit: number,
  search: string,
  sortField: string,
  sortOrder: SortOrder,
): Promise<{
  data: ICoupon[];
  count: number;
}> => {
  const offset = (page - 1) * limit;

  const query = {
    $or: [
      { couponCode: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ],
  };

  const data = await Coupon.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ [sortField]: sortOrder });

  const count = await Coupon.countDocuments(query);

  return { data, count };
};

export const getCouponByIdService = async (
  couponId: unknown,
): Promise<ICoupon | null> => {
  // Validate ObjectId
  if (typeof couponId !== "string" || !Types.ObjectId.isValid(couponId)) {
    throw new Error("INVALID_ID");
  }

  const coupon = await Coupon.findById(couponId).lean<ICoupon>().exec();
  return coupon;
};
