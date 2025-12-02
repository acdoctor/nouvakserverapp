import {
  HomeBanner,
  IHomeBanner,
} from "../../models/homeBanner/homeBanner.model";
import { SortOrder } from "mongoose";

interface SaveHomeBannerPayload {
  imageUrl: string;
  destination: "COUPON" | "AD";
  position: number;
  data: string;
}

export const saveHomeBannerService = async (
  payload: SaveHomeBannerPayload,
): Promise<IHomeBanner> => {
  const { imageUrl, destination, position, data } = payload;

  const banner = new HomeBanner({
    imageUrl,
    destination,
    position,
    data,
  });

  await banner.save();
  return banner;
};

export const editHomeBannerService = async (
  homeBannerId: string,
  payload: {
    imageUrl: string;
    destination: "COUPON" | "AD";
    position: number;
    data: string;
  },
): Promise<IHomeBanner | null> => {
  const updatedHomeBanner = await HomeBanner.findByIdAndUpdate(
    homeBannerId,
    payload,
    { new: true },
  );

  return updatedHomeBanner;
};

export const getHomeBannerListService = async (
  sortField: string,
  sortOrder: SortOrder,
): Promise<IHomeBanner[]> => {
  const sortObj: Record<string, SortOrder> = {
    [sortField]: sortOrder,
  };

  return await HomeBanner.find().sort(sortObj);
};

export const deleteHomeBannerService = async (
  bannerId: string,
): Promise<boolean> => {
  const deleted = await HomeBanner.findByIdAndDelete(bannerId);
  return !!deleted;
};
