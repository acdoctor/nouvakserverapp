import { Types } from "mongoose";
import { Brand } from "../../models/brand/brand.model";

export interface AdminCreateEditBrandPayload {
  brandId?: string;
  name: string;
}

export const adminCreateEditBrandService = async (
  payload: AdminCreateEditBrandPayload,
) => {
  const { brandId, name } = payload;

  // ----------- VALIDATION -----------

  if (!name.trim()) {
    throw new Error("BRAND_NAME_REQUIRED");
  }

  if (brandId && !Types.ObjectId.isValid(brandId)) {
    throw new Error("INVALID_BRAND_ID");
  }

  // ----------- EDIT BRAND -----------
  if (brandId) {
    const existingBrand = await Brand.findOne({ name: name.trim() });

    if (existingBrand && String(existingBrand._id) !== brandId) {
      throw new Error("BRAND_NAME_EXISTS");
    }

    await Brand.updateOne({ _id: brandId }, { name: name.trim() });

    return { message: "Brand updated successfully" };
  }

  // ----------- CREATE BRAND -----------
  const existingBrand = await Brand.findOne({ name: name.trim() });

  if (existingBrand) {
    throw new Error("BRAND_ALREADY_EXISTS");
  }

  await Brand.create({ name: name.trim() });

  return { message: "Brand created successfully" };
};
