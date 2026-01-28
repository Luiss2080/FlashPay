# Credenciales de Acceso - FlashPay

Para iniciar sesión en la aplicación durante la fase de desarrollo y pruebas, utiliza las siguientes credenciales.

## Usuario Principal (Test)

Este usuario tiene datos precargados (contactos, servicios, saldo inicial).

- **Correo:** `test@flashpay.com`
- **Contraseña:** `123456`

## Modo de Desarrollo

El sistema actual tiene habilitado un modo de acceso simplificado para facilitar las pruebas con cualquier usuario de la base de datos.

- **Contraseña Maestra:** `123456`

Cualquier usuario registrado en la base de datos puede iniciar sesión utilizando su correo electrónico y la contraseña `123456`, independientemente de cuál sea su contraseña real encriptada.

## Base de Datos

Si necesitas gestionar usuarios directamente:

- **Host:** localhost
- **Usuario:** root
- **Base de datos:** FlashPay

Para resetear la contraseña de un usuario específico a un valor conocido, puedes usar la funcionalidad de "Recuperar Contraseña" (simulada) o editar directamente la tabla `Usuarios`.
