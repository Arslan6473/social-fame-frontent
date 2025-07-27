import axios from "axios";

export const uploadFile = async (file) => {
  if (!import.meta.env.VITE_APP_CLOUD_NAME || !import.meta.env.VITE_APP_UPLOAD_PRESET) {
    console.error("Cloudinary configuration missing in environment variables");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data?.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error.response?.data || error.message);
    return null;
  }
};
