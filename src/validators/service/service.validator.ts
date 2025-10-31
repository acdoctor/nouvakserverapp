import Joi from "joi";
import { ServiceCategory } from "../../models/service/service.model";

export const addServiceSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  description: Joi.array().items(Joi.object()).optional(),
  terms: Joi.array().items(Joi.object()).optional(),
  banner_images: Joi.array()
    .items(Joi.object({ type: Joi.string(), url: Joi.string().uri() }))
    .optional(),
  category: Joi.string()
    .valid(...Object.values(ServiceCategory))
    .required(),
  key: Joi.string().optional(),
});

//  Validation schema for service list query params

export const serviceListValidator = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number.",
    "number.integer": "Page must be an integer.",
    "number.min": "Page number must be at least 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "Limit must be a number.",
    "number.integer": "Limit must be an integer.",
    "number.min": "Limit must be at least 1.",
    "number.max": "Limit cannot exceed 100.",
  }),
  search: Joi.string().trim().allow("").optional(),
  sortby: Joi.string()
    .valid("name", "createdAt", "orderBy", "updatedAt")
    .optional()
    .messages({
      "any.only":
        "Sort field must be one of name, createdAt, orderBy, or updatedAt.",
    }),
  orderby: Joi.string().valid("asc", "desc").optional().messages({
    "any.only": "Order by must be either 'asc' or 'desc'.",
  }),
});
