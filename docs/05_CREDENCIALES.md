# 05. Credenciales de Prueba

## Usuario por Defecto

Usuarios sembrados por `backend/db/seeders/001_users.sql` (contraseña de demostración solo para desarrollo, guardada con bcrypt):

- **Usuario:** `test@flashpay.com` (o `admin@flashpay.com`)
- **Contraseña:** `123456`

## Autenticación

El backend **ya no** acepta una contraseña maestra para cualquier usuario. El login (`POST /auth/login`) verifica la contraseña con bcrypt y devuelve un JWT (HS256, 12 h) que la app envía como `Authorization: Bearer <token>` en todas las rutas `/api`. Las cuentas antiguas con contraseña en texto plano se aceptan una sola vez y se re-guardan con hash al iniciar sesión.

Define `JWT_SECRET` en `backend/.env` (obligatorio si `NODE_ENV=production`).
