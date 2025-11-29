import Joi from "joi";

export const adminCreateEditBrandSchema = Joi.object({
  brandId: Joi.string().optional().messages({
    "string.base": "brandId must be a string",
  }),

  name: Joi.string().trim().required().messages({
    "any.required": "Brand name must be provided",
    "string.empty": "Brand name must not be empty",
  }),
});
