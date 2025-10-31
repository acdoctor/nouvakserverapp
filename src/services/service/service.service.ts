import { Service, IService } from "../../models/service/service.model";
import { Types } from "mongoose";

export const findServiceByNameAndCategory = async (
  name: string,
  category: string,
): Promise<IService | null> => {
  return Service.findOne({ name, category });
};

export const createService = async (
  serviceData: Partial<IService>,
): Promise<IService> => {
  const newService = new Service(serviceData);
  return newService.save();
};

export const findServiceById = async (
  serviceId: string,
): Promise<IService | null> => {
  if (!Types.ObjectId.isValid(serviceId)) return null;
  return Service.findById(serviceId);
};

export const findDuplicateService = async (
  serviceId: string,
  name: string,
  category: string,
): Promise<IService | null> => {
  return Service.findOne({
    _id: { $ne: serviceId },
    name,
    category,
  });
};

export const updateServiceById = async (
  serviceId: string,
  updateData: Partial<IService>,
): Promise<IService | null> => {
  return Service.findByIdAndUpdate(serviceId, updateData, { new: true });
};

// Toggle service active/inactive status

export const toggleServiceStatus = async (
  serviceId: string,
): Promise<IService | null> => {
  if (!Types.ObjectId.isValid(serviceId)) return null;

  const service = await Service.findById(serviceId);
  if (!service) return null;

  const newStatus = !service.isActive;

  return Service.findByIdAndUpdate(
    serviceId,
    { isActive: newStatus },
    { new: true },
  );
};
