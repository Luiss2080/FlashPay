import axios from "axios";

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

export default api;
