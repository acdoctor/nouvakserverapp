import Joi from "joi";

export const adminUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "super_admin").optional(),
  status: Joi.string().valid("pending", "active", "blocked").optional(),
  countryCode: Joi.string()
    .pattern(/^\+[0-9]{1,4}$/)
    .optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
}).min(1); // At least one field must be provided
