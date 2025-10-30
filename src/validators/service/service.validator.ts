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
