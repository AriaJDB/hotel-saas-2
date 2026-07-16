# 🏨 Hotel SaaS - Sistema de Gestión de Reservaciones

Este proyecto es una solución de gestión hotelera bajo el modelo SaaS, desarrollada para la materia de Desarrollo Web Profesional. El sistema permite administrar habitaciones, reservaciones, usuarios, artículos y pedidos, además de manejar autenticación, recuperación de contraseña y sesiones de usuario.

## 📂 Estructura del Proyecto

El repositorio está organizado en tres bloques principales:

### 🖥️ Backend
Carpeta: `backend/`

- `bd/`: conexión y acceso a datos con Firestore.
- `clases/`: modelos de negocio (`Usuario`, `Habitacion`, `Reservacion`, `Articulo`, `Pedido`).
- `middlewares/`: servicios de correo, recuperación de contraseña y funciones de seguridad.
- `rutas/`: endpoints HTTP de la API.
- `jobs/`: tareas programadas como `autoCheckout.js`.
- `index.js`: configuración global de Express, CORS, sesiones y rutas.

### 🎨 Frontend
Carpeta: `frontend/`

- `src/api/`: servicios para consumir el backend.
- `src/pages/`: vistas del sistema.
- `src/components/`: componentes reutilizables y secciones administrativas.
- `src/hooks/`: hooks para datos y lógica de UI.
- `src/styles/`: hojas de estilo.

### ⚙️ Infraestructura

- `docker-compose.yml`: orquestación con frontend, backend y Nginx.
- `nginx/`: configuración del proxy inverso.
- `keys.json`: credenciales de Firebase / servicio de autenticación para el backend.

## 🛠️ Stack Tecnológico

- Frontend: React 19, Vite, React Router, Axios.
- Backend: Node.js, Express 5, Express Session, dotenv, CORS.
- Base de datos: Firebase Firestore.
- Seguridad: hash de contraseñas, autenticación por sesión y recuperación de credenciales.
- Contenerización: Docker + Docker Compose.

## ✅ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js LTS (preferentemente una versión reciente)
- npm
- Docker Desktop y Docker Compose (opcional, si usarás contenedores)
- Una cuenta de Firebase con servicio de autenticación configurado

## 🚀 Instalación y Configuración

### 1. Clonar y preparar el proyecto

```bash
git clone <url-del-repositorio>
cd hotel-saas-2
```

### 2. Configurar las credenciales de Firebase

El backend requiere un archivo `keys.json` en la raíz del proyecto. Ese archivo debe contener la credencial del servicio de Firebase en formato JSON.

Ubicación esperada:

```text
hotel-saas-2/
└── keys.json
```

Si prefieres apuntar a otra ruta, puedes definir la variable de entorno:

```bash
FIREBASE_KEY_PATH=/ruta/absoluta/a/keys.json
```

> El backend intenta cargar `keys.json` desde la raíz del proyecto por defecto y lo usa para inicializar `firebase-admin`.

### 3. Configurar las variables de entorno del backend

Crea un archivo `.env` dentro de `backend/` si deseas personalizar la configuración:

```env
PORT=3000
KEYS=secreto_temporal_escolar
FIREBASE_KEY_PATH=../keys.json
```

Notas:

- `PORT`: puerto donde escuchará el backend.
- `KEYS`: secreto para la sesión de Express.
- `FIREBASE_KEY_PATH`: ruta opcional a la clave de Firebase.

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
npm run dev
```

Comandos útiles:

```bash
npm run dev
npm start
```

El backend quedará disponible en:

```text
http://localhost:3000
```

### 5. Instalar dependencias del frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La interfaz de desarrollo se servirá en:

```text
http://localhost:5173
```

> El frontend actualmente apunta al backend en `http://localhost:3000`, por lo que ambos servicios deben ejecutarse simultáneamente en desarrollo.

## 🐳 Ejecución con Docker Compose

Si deseas levantar el proyecto completo con contenedores:

```bash
docker compose up --build
```

Esto levanta:

- `frontend`
- `backend`
- `nginx`

El proyecto queda expuesto por Nginx en:

```text
http://localhost
https://localhost
```

### Volumen importante

El `docker-compose.yml` monta el archivo `keys.json` en el contenedor del backend en modo de solo lectura:

```yaml
volumes:
  - ./keys.json:/keys.json:ro
```

Por eso, `keys.json` debe existir antes de iniciar los contenedores.

## 🔐 Características de Seguridad

- No se almacenan contraseñas en texto plano.
- Se usa hashing y sal por usuario.
- Las sesiones se manejan con `express-session`.
- La validación de datos se realiza en el backend para evitar inconsistencias en la interfaz.

## 📌 Resumen rápido

Si vas a correr el proyecto en modo local:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Si vas a usar Docker:

```bash
docker compose up --build
```
