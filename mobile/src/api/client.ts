import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ganti sesuai IP laptop kamu di jaringan WiFi yang sama (cek pakai `ipconfig`)
const BASE_URL = "http://192.168.18.1:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
