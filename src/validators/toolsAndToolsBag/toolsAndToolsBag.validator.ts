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
    "string.base": '"Tools bag name" should be a type of text',
    "string.empty": '"Tools bag name" cannot be an empty field',
    "any.required": '"Tools bag name" is a required field',
  }),

  description: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": '"description" should be a type of text',
  }),

  tools: Joi.array()
    .items(
      Joi.object({
        toolId: Joi.string().required().messages({
          "string.base": '"toolId" should be a type of text',
          "string.empty": '"toolId" cannot be an empty field',
          "any.required": '"toolId" is a required field',
        }),

        name: Joi.string().required().messages({
          "string.base": '"Tool name" should be a type of text',
          "string.empty": '"Tool name" cannot be an empty field',
          "any.required": '"Tool name" is a required field',
        }),

        quantity: Joi.number().required().messages({
          "number.base": '"quantity" should be a type of number',
          "any.required": '"quantity" is a required field',
        }),

        description: Joi.string().optional().allow(null, "").messages({
          "string.base": '"description" should be a type of text',
        }),
      }),
    )
    .required()
    .messages({
      "array.base": '"tools" should be an array of objects',
      "any.required": '"tools" is a required field',
    }),

  image: Joi.string().optional().default("").messages({
    "string.base": '"image" should be a type of text',
  }),
});

export const updateToolBagSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.base": '"name" should be a type of text',
  }),

  description: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": '"description" should be a type of text',
  }),

  tools: Joi.array()
    .items(
      Joi.object({
        toolId: Joi.string().required().messages({
          "string.base": '"toolId" should be a type of text',
          "string.empty": '"toolId" cannot be an empty field',
          "any.required": '"toolId" is a required field',
        }),

        name: Joi.string().required().messages({
          "string.base": '"Tool name" should be a type of text',
          "string.empty": '"Tool name" cannot be an empty field',
          "any.required": '"Tool name" is a required field',
        }),

        quantity: Joi.number().required().messages({
          "number.base": '"quantity" should be a type of number',
          "any.required": '"quantity" is a required field',
        }),

        description: Joi.string().optional().allow(null, "").messages({
          "string.base": '"description" should be a type of text',
        }),
      }),
    )
    .optional()
    .messages({
      "array.base": '"tools" should be an array of objects',
    }),

  image: Joi.string().optional().messages({
    "string.base": '"image" should be a type of text',
  }),
});

export const getToolBagListSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  search: Joi.string().trim().optional(),
});
