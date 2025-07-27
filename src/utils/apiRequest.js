import axios from "axios";

const APP_URL = "https://social-fame-backend.vercel.app";

export const API = axios.create({
  baseURL: APP_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, method = "GET", data }) => {
  try {
    const config = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...(data && { data }), 
    };

    const result = await API(config);

    return result?.data;
  } catch (error) {
    console.log(error);
    const err = error.response?.data;
    return { success: "failed", message: err.message };
  }
};

