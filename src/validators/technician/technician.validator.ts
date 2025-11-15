import Joi from "joi";

export const updateTechnicianSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.string().optional(),
  status: Joi.string().optional(),
  email: Joi.string().email().optional(),
  profilePhoto: Joi.string().uri().optional(),
}).min(1);

export const technicianListValidator = Joi.object({
  search: Joi.string().allow("", null).optional(),

  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  active: Joi.boolean().optional(),

  status: Joi.string()
    .valid("PENDING", "APPROVED", "REJECTED")
    .optional()
    .messages({
      "any.only": "Status must be PENDING, APPROVED or REJECTED",
    }),
});

export const updateKycStatusValidator = Joi.object({
  technicianId: Joi.string().required().messages({
    "string.empty": "Technician ID is required",
  }),

  action: Joi.string()
    .valid("APPROVE", "REJECT", "REQUEST")
    .required()
    .messages({
      "any.only": "Invalid action. Allowed actions: APPROVE, REJECT, REQUEST",
      "string.empty": "Action is required",
    }),
});

export const technicianIdParamValidator = Joi.object({
  technicianId: Joi.string().length(24).required(),
});
