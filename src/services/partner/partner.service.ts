import Partner, { IPartner } from "../../models/partner/partner.model";

interface AddEditPartnerPayload {
  name: string;
  partnerId?: string;
  partnerLogo: string;
}

export const addEditPartnerService = async (
  payload: AddEditPartnerPayload,
): Promise<IPartner | null> => {
  const { name, partnerId, partnerLogo } = payload;

  // CREATE
  if (!partnerId) {
    const exists = await Partner.findOne({ name });
    if (exists) {
      throw new Error("Partner with this name already exists");
    }

    const newPartner = await Partner.create({
      name,
      logo: partnerLogo,
    });

    return newPartner;
  }

  // UPDATE
  const existingPartner = await Partner.findById(partnerId);

  if (!existingPartner) {
    throw new Error("Partner not found");
  }

  await Partner.updateOne(
    { _id: partnerId },
    {
      name,
      logo: partnerLogo || existingPartner.logo,
    },
  );

  return await Partner.findById(partnerId);
};
