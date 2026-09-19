# Credenciales y acceso

- **Usuario de prueba:** `test@flashpay.com` (o `admin@flashpay.com`)
- **Contraseña:** `123456` (solo desarrollo; los seeders la guardan con bcrypt)

No existe contraseña maestra: cada usuario entra únicamente con su propia contraseña. Las sesiones usan un JWT firmado (`JWT_SECRET`, ver `backend/.env.example`).

## Base de Datos

- **Host:** localhost
- **Usuario:** root
- **Base de datos:** FlashPay

Para resetear la contraseña de un usuario, guarda un hash bcrypt en `Usuarios.password` (por ejemplo generado con `bcryptjs`) o usa un valor en texto plano: se convertirá a hash en su próximo login.
