import Joi from "joi";

export const addEditPartnerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),

  partnerLogo: Joi.string().trim().required().messages({
    "string.base": "Partner logo must be a string.",
    "string.empty": "Partner logo is required.",
    "any.required": "Partner logo is required.",
  }),

  partnerId: Joi.string().optional().messages({
    "string.base": "Partner ID must be a string.",
  }),
});
