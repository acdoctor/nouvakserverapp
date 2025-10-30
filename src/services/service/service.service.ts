import { Service, IService } from "../../models/service/service.model";

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
