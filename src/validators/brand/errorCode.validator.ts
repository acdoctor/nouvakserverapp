import Joi from "joi";

export const createEditErrorCodeSchema = Joi.object({
  brandId: Joi.string().required().messages({
    "string.base": "brandId must be a string",
    "any.required": "brandId is required",
  }),

  errorCodeId: Joi.string().optional(),

  code: Joi.string().allow("").default(""),

  acType: Joi.string().required().messages({
    "string.base": "acType must be a string",
    "any.required": "acType is required",
  }),

  models: Joi.string().required().messages({
    "string.base": "models must be a string",
    "any.required": "models is required",
  }),

  solution: Joi.array().items(Joi.string().trim()).default([]),

  description: Joi.string().allow("").default(""),

  category: Joi.string()
    .valid("INVERTOR", "NON_INVERTOR")
    .default("NON_INVERTOR"),
});
