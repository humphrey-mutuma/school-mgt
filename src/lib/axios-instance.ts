import axios from "axios";
import toast from "react-hot-toast";
import useUserStore from "../store/user-store";

const APIS_BASE_URL = import.meta.env.VITE_PUBLIC_APIS_BASE_URL; // ✅ Use import.meta.env

export const axiosInstanceInsecure = axios.create({
  baseURL: APIS_BASE_URL,
});
// Axios instance with interceptors
export const axiosInstance = axios.create({
  baseURL: APIS_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken } = useUserStore.getState();

    if (!accessToken) {
      toast.error("Session expired. Please sign in!");
      // logOut();
      // window.location.href = "/auth";
      return Promise.reject(new Error("Refresh token expired"));
    }

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
