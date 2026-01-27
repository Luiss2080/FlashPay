import axios from "axios";

// REEMPLAZAR con la IP de tu máquina local (ej. 192.168.x.x) si usas dispositivo físico
// O 'http://10.0.2.2/FlashPay/api' para emulador Android
// O 'http://localhost/FlashPay/api' para emulador iOS
const API_URL = "http://192.168.1.10/FlashPay/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
