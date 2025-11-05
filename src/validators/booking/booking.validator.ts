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

export const editBookingValidator = Joi.object({
  serviceDetails: Joi.array()
    .items(
      Joi.object({
        service_id: Joi.string().required(),
        quantity: Joi.string().required(),
        acType: Joi.string().optional().allow(""),
        place: Joi.string().optional().allow(""),
        comment: Joi.string().optional().allow(""),
      }),
    )
    .optional(),
  addressId: Joi.string().required(),
  slot: Joi.string().valid("FIRST_HALF", "SECOND_HALF").required(),
  date: Joi.date().required(),
  amount: Joi.number().required(),
});
