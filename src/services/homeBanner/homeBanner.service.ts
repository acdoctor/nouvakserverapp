import {
  HomeBanner,
  IHomeBanner,
} from "../../models/homeBanner/homeBanner.model";

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
