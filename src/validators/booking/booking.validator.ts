import Joi from "joi";

export const createBookingSchema = Joi.object({
  user_id: Joi.string().required(),
  name: Joi.string().required(),
  addressId: Joi.string().required(),
  slot: Joi.string().required(),
  date: Joi.date().iso().required(),
  amount: Joi.number().positive().required(),
  order_id: Joi.string().optional(),
  serviceDetails: Joi.array()
    .items(
      Joi.object({
        service_id: Joi.string().required(),
        acType: Joi.string().optional(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});
