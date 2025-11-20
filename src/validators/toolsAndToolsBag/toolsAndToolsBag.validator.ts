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

export const removeToolIdParamsSchema = Joi.object({
  toolId: Joi.string().length(24).hex().required(),
});

export const addToolBagSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tool bag name is required",
    "any.required": "Tool bag name is required",
  }),

  description: Joi.string().trim().allow("").optional(),

  tools: Joi.array()
    .items(
      Joi.object({
        toolId: Joi.string().required().messages({
          "string.empty": "toolId is required",
        }),
        quantity: Joi.number().min(1).required().messages({
          "any.required": "Quantity is required",
          "number.min": "Quantity must be at least 1",
        }),
        name: Joi.string().required(),
        description: Joi.string().allow("").optional(),
      }),
    )
    .optional()
    .default([]),
});
