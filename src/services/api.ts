import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// REEMPLAZAR con la IP de tu máquina local (ej. 192.168.x.x) si usas dispositivo físico
// O 'http://10.0.2.2/FlashPay/api' para emulador Android
// O 'http://localhost/FlashPay/api' para emulador iOS
// Use localhost for Web/Desktop. Use 10.0.2.2 for Android Emulator. Use machine IP for real device.
const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el JWT guardado al iniciar sesion; el backend toma el usuario del token.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
