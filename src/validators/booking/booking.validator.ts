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

export const bookingListValidator = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  status: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()),
      Joi.string().custom((value) => value.split(",")),
    )
    .optional()
    .messages({
      "string.base": "Status must be a string or an array of strings",
    }),

  search: Joi.string().allow("").optional(),
  sortby: Joi.string()
    .valid("createdAt", "date", "amount")
    .optional()
    .messages({ "any.only": "Invalid sort field" }),

  orderby: Joi.string()
    .valid("asc", "desc")
    .optional()
    .messages({ "any.only": "orderby must be 'asc' or 'desc'" }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "startDate must be in ISO date format",
  }),

  endDate: Joi.date().iso().optional().messages({
    "date.format": "endDate must be in ISO date format",
  }),
});
