import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IP laptop di jaringan WiFi (cek pakai `ipconfig` jika berubah)
const BASE_URL = "http://192.168.18.99:5000";

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
