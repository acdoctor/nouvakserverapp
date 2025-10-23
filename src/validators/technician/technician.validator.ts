import Joi from "joi";

export const updateTechnicianSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.string().optional(),
  status: Joi.string().optional(),
  email: Joi.string().email().optional(),
  profilePhoto: Joi.string().uri().optional(),
}).min(1);
