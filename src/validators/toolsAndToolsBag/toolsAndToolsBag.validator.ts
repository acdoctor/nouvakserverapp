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
