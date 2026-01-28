# Especificaciones Técnicas - FlashPay

## Visión General

FlashPay es una billetera digital moderna ("Yape-like") diseñada para facilitar transferencias, pagos de servicios y gestión de finanzas personales. La aplicación prioriza una experiencia de usuario fluida, animaciones atractivas y una arquitectura robusta.

## Stack Tecnológico

### Frontend (Móvil)

- **Framework:** React Native (v0.76+) con Expo (SDK 52).
- **Lenguaje:** TypeScript.
- **UI/UX:**
  - `react-native-paper`: Componentes base (Botones, Tarjetas, Inputs).
  - `react-native-safe-area-context`: Manejo de "Notch" y áreas seguras.
  - `react-native-reanimated`: Animaciones complejas.
  - `@expo/vector-icons`: Iconografía (Ionicons).
  - **Estilos:** StyleSheet nativo con sistema de temas centralizado (`src/utils/theme.ts`).
- **Navegación:** React Navigation v7 (Stack + BottomTabs).
- **Gestión de Estado:** `useState` + `useEffect` (Hooks nativos) y `AsyncStorage` para persistencia local ligera.

### Backend (API)

- **Runtime:** Node.js.
- **Framework:** Express.
- **Base de Datos:** MySQL (Driver `mysql2` con Pool de conexiones).
- **Lenguaje:** TypeScript.
- **Estructura:** MVC (Controladores en `src/controllers`, Rutas en `src/routes`).

## Arquitectura del Proyecto

### Estructura de Carpetas (Frontend)

- `src/components`: Componentes reutilizables (Botones, Tarjetas, Headers).
- `src/screens` / `src/views`: Pantallas de la aplicación organizadas por módulos (Inico, Operaciones, Perfil).
- `src/navigation`: Configuración del enrutador (Stack y Tabs).
- `src/services`: Capa de comunicación con la API (`api.ts` con Axios).
- `src/utils`: Utilidades, helpers y constantes global (Tema, Formato de moneda).

### Funcionalidades Implementadas

#### 1. Autenticación y Seguridad

- Login con validación de credenciales (Base de datos MySQL).
- Soporte para Biometría (FaceID / TouchID) usando `expo-local-authentication`.
- "Ocultar Saldo" al inicio (Preferencia de privacidad).

#### 2. Operaciones Financieras

- **Transferencias:** Envío de dinero a contactos o números telefónicos. Formato automático de celular y moneda.
- **Recargas:** Simulación de recarga de saldo.
- **Pago de Servicios:** Pago de Luz, Agua, Telefonía con validación de código de suministro.
- **Código QR:**
  - Escaneo de QR para pagar (`expo-camera`).
  - Generación de QR para cobrar (`react-native-qrcode-svg`) con montos personalizados.
  - Enlace profundo (`flashpay://`) preparado para integración futura.

#### 3. Gestión y Personalización

- **Metas de Ahorro:** Creación y seguimiento de objetivos financieros visuales.
- **Personalización:** Cambio de tema (Claro/Oscuro - Estructura lista), visibilidad de saldo.
- **Contactos Favoritos:** Gestión CRUD de contactos frecuentes.

#### 4. Experiencia de Usuario (UX)

- **Animaciones:** `FadeInView` para entradas suaves en listas y formularios.
- **Micro-interacciones:** Feedback háptico (`expo-haptics`) al presionar botones o completar acciones.
- **Glassmorphism:** Estilos visuales modernos con transparencias en el Dashboard.

## Base de Datos

El esquema SQL se encuentra en `backend/db/`.

- `Usuarios`: Información de perfil y saldo.
- `Transacciones`: Historial de movimientos.
- `Servicios`: Catálogo de servicios pagables.
- `Metas`: Objetivos de ahorro del usuario.
- `Promociones`: Ofertas dinámicas mostradas en el Home.
