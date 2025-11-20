import Joi from "joi";

export const addToolSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tool name is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Tool description is required",
  }),

  image: Joi.string().uri().optional().allow(""),
});

export const updateToolSchema = Joi.object({
  toolId: Joi.string().required(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  image: Joi.string().optional(),
});

export const getToolListSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().allow("").optional(),
});
