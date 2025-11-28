// src/services/leads/leads.service.ts
import moment from "moment";
import Lead, { ILead } from "../../models/leads/leads.model";
// import { Types } from "mongoose";

const ALLOWED_PLACE = ["commercial", "residential"];

// helper for DDMM format
// const getFormattedDate = (): string => {
//   const now = new Date();
//   const dd = String(now.getDate()).padStart(2, "0");
//   const mm = String(now.getMonth() + 1).padStart(2, "0");
//   return `${dd}${mm}`;
// };

export const createLeadService = async (
  place: string,
  quantity: number,
  userId: string,
  comment?: string,
): Promise<ILead> => {
  // Validation
  if (!place) {
    throw new Error("Place is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!quantity) {
    throw new Error("Quantity is required");
  }
  if (!ALLOWED_PLACE.includes(place)) {
    throw new Error("Invalid place value. Allowed: commercial, residential");
  }

  const count = await Lead.countDocuments();
  const formattedDate = moment().format("DDMM");
  const leadId = `LEAD-${formattedDate}-${count + 1}`;

  const createdLead = await Lead.create({
    place,
    quantity,
    user_id: userId,
    comment: comment || "",
    leadId,
  });

  return createdLead;
};

export const getUserLeadDetailsService = async (leadId: string) => {
  if (!leadId || leadId.trim() === "") {
    throw new Error("Lead id is required");
  }

  const result = await Lead.aggregate([
    {
      $match: { leadId: leadId }, // match custom string id
    },
    {
      $project: {
        _id: 1,
        place: { $ifNull: ["$place", ""] },
        quantity: { $ifNull: ["$quantity", ""] },
        leadId: { $ifNull: ["$leadId", ""] },
        comment: { $ifNull: ["$comment", ""] },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (result.length === 0) return null;

  return result[0];
};
