# 03. Configuración y Puertos

## Puertos Utilizados

| Servicio            | Puerto | Descripción                           |
| ------------------- | ------ | ------------------------------------- |
| **Frontend (Expo)** | `8081` | Servidor de desarrollo metro bundler. |
| **Backend (API)**   | `3001` | Servidor Express (API REST).          |
| **Base de Datos**   | `3306` | Servidor MySQL por defecto.           |

## Variables de Entorno (.env)

El backend utiliza un archivo `.env` en `backend/.env`.

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=FlashPay
```
