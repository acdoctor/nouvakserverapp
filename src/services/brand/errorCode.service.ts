import { Brand } from "../../models/brand/brand.model";
import { Types } from "mongoose";

interface IUpdateOrCreateErrorCodeInput {
  brandId: string;
  errorCodeId?: string;
  code: string;
  acType: string;
  models: string;
  solution: string[];
  category: "INVERTOR" | "NON_INVERTOR";
  description: string;
}

export interface IErrorCodeListRequest {
  brandId: string;
  errorCode: string;
  acType: "INVERTOR" | "NON_INVERTOR";
}

export const createOrUpdateErrorCodeService = async (
  payload: IUpdateOrCreateErrorCodeInput,
) => {
  const {
    brandId,
    errorCodeId,
    code,
    acType,
    models,
    solution,
    description,
    category,
  } = payload;

  const errorCode = {
    code: code || "",
    acType,
    models,
    solution: solution || [],
    description: description || "",
    category: category || "NON_INVERTOR",
  };

  if (errorCodeId) {
    // Update existing global error code
    const result = await Brand.updateOne(
      {
        _id: brandId,
        "globalErrorCodes._id": errorCodeId,
      },
      {
        $set: {
          "globalErrorCodes.$.code": errorCode.code,
          "globalErrorCodes.$.solution": errorCode.solution,
          "globalErrorCodes.$.acType": errorCode.acType,
          "globalErrorCodes.$.models": errorCode.models,
          "globalErrorCodes.$.category": errorCode.category,
          "globalErrorCodes.$.description": errorCode.description,
        },
      },
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: "Error code not found to update",
      };
    }

    return {
      success: true,
      message: "Error code updated successfully",
    };
  }

  // Create new global error code
  await Brand.updateOne(
    { _id: brandId },
    { $push: { globalErrorCodes: errorCode } },
  );

  return {
    success: true,
    message: "Error code saved successfully",
  };
};

export const errorCodeListService = async (
  payload: IErrorCodeListRequest,
): Promise<unknown> => {
  const { brandId, errorCode, acType } = payload;

  const brand = await Brand.findOne(
    {
      _id: new Types.ObjectId(brandId),
      "globalErrorCodes.code": errorCode,
      "globalErrorCodes.acType": acType,
    },
    {
      globalErrorCodes: { $elemMatch: { code: errorCode } },
    },
  );

  if (!brand) {
    return null;
  }

  return brand.globalErrorCodes[0];
};
