import { Request, Response } from "express";
import {
  createCouponService,
  updateCouponService,
} from "../../services/coupon/coupon.service";

export const addEditCouponController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      couponObjectid,
      couponCode,
      image,
      name,
      discount,
      minValue,
      expiryDate,
      description,
    } = req.body as {
      couponObjectid: string;
      couponCode: string;
      image?: string;
      name: string;
      discount: number;
      minValue: number;
      expiryDate: Date;
      description: string[];
    };

    // CREATE
    if (!couponObjectid || couponObjectid === "") {
      const created = await createCouponService({
        couponCode,
        ...(image !== undefined ? { image } : {}),
        name,
        discount,
        minValue,
        expiryDate,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        data: created,
      });
    }

    // UPDATE
    const updated = await updateCouponService(couponObjectid, {
      couponCode,
      ...(image !== undefined ? { image } : {}),
      name,
      discount,
      minValue,
      expiryDate,
      description,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updated,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
