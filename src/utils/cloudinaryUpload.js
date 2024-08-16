import axios from "axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
  formData.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload`,
      formData
    );

    return response?.data?.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
