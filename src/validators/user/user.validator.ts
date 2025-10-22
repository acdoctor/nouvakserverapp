import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isActive: Joi.number().valid(0, 1).optional(),
  type: Joi.string().valid("RETAIL", "HNI", "SME", "LARGE_SCALE").optional(),
  deviceToken: Joi.string().optional(),
}).min(1); // ✅ Ensure at least one field is passed
