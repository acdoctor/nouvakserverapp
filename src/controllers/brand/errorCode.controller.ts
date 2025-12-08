import { Request, Response } from "express";
import { createOrUpdateErrorCodeService } from "../../services/brand/errorCode.service";
interface ICreateEditErrorCodeBody {
  brandId: string;
  errorCodeId?: string;
  acType: string;
  models: string;
  code: string;
  solution: string[];
  description: string;
  category: "INVERTOR" | "NON_INVERTOR";
}

export const adminCreateEditErrorCode = async (
  req: Request<unknown, unknown, unknown>,
  res: Response,
) => {
  try {
    const body = req.body as unknown;

    const {
      brandId,
      errorCodeId,
      acType,
      models,
      code,
      solution,
      description,
      category,
    } = body as ICreateEditErrorCodeBody;

    if (!brandId) {
      return res
        .status(400)
        .json({ success: false, message: "brandId required" });
    }

    const response = await createOrUpdateErrorCodeService({
      brandId,
      ...(errorCodeId && { errorCodeId }),
      acType,
      models,
      code,
      solution,
      description,
      category,
    });

    return res.status(response.success ? 200 : 404).json(response);
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
