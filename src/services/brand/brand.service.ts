import { PipelineStage, Types } from "mongoose";
import { Brand } from "../../models/brand/brand.model";

export interface AdminCreateEditBrandPayload {
  brandId?: string;
  name: string;
}

interface BrandListParams {
  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: 1 | -1;
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

export const toggleBrandStatusService = async (brandId: string) => {
  if (!Types.ObjectId.isValid(brandId)) {
    throw new Error("INVALID_BRAND_ID");
  }

  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw new Error("BRAND_NOT_FOUND");
  }

  const newStatus = brand.isActive === 1 ? 0 : 1;

  await Brand.updateOne({ _id: brandId }, { isActive: newStatus });

  return {
    message: newStatus === 1 ? "Brand activated" : "Brand inactivated",
  };
};

export const getBrandListService = async ({
  page,
  limit,
  search,
  sortField,
  sortOrder,
}: BrandListParams) => {
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [
    {
      $unwind: { path: "$globalErrorCodes", preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "globalErrorCodes.code": { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        isActive: { $first: "$isActive" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        expiryDate: { $first: "$expiryDate" },
        registeredDate: {
          $first: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        globalErrorCodes: { $push: "$globalErrorCodes" },
      },
    },
    {
      $project: {
        _id: 1,
        name: { $ifNull: ["$name", ""] },
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        expiryDate: 1,
        globalErrorCodes: 1,
        registeredDate: 1,
        errorCodeCount: { $size: { $ifNull: ["$globalErrorCodes", []] } },
      },
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
  ];

  const list = await Brand.aggregate(pipeline);

  // Total count
  const countResult = await Brand.aggregate([
    {
      $match: {
        name: { $regex: search, $options: "i" },
      },
    },
    { $count: "totalCount" },
  ]);

  const totalCount = countResult.length ? countResult[0].totalCount : 0;

  return { list, totalCount };
};
