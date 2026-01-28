import axios from "axios";

// REEMPLAZAR con la IP de tu máquina local (ej. 192.168.x.x) si usas dispositivo físico
// O 'http://10.0.2.2/FlashPay/api' para emulador Android
// O 'http://localhost/FlashPay/api' para emulador iOS
// Node.js Backend URL (Emulator: 10.0.2.2:3000, Device: Your IP:3000)
const API_URL = "http://10.0.2.2:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
