# 02. Instalación y Ejecución

## Requisitos Previos

- Node.js (v18+)
- MySQL Server (XAMPP/Laragon recomendado)
- Expo Go en tu celular (o Emulador Android/iOS)

## Pasos

1. **Base de Datos:**
   - Asegúrate que MySQL esté corriendo en el puerto 3306.
   - Crea la base de datos `FlashPay`.
   - Ejecuta los scripts en `backend/db/` en orden numérico.

2. **Backend:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend:**
   ```bash
   # En una nueva terminal
   cd ..
   npm install
   npx expo start
   ```
