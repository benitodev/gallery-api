import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "benitok",
  api_key: "781291778399789",
  api_secret: "juQCtrQaw1wiz8SB-H0phPubZb0",
});
export const uploadImage = async (filePath) => {
  const res = await cloudinary.uploader.upload(filePath, {
    folder: "images-gallery",
  });
  return res;
};
