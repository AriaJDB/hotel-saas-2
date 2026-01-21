# 🏨 Hotel SaaS - Sistema de Gestión de Reservaciones

Este proyecto es un sistema de gestión hotelera bajo el modelo **SaaS (Software as a Service)**, desarrollado para la materia de Desarrollo Web Profesional del 8vo cuatrimestre. El sistema permite la administración de usuarios, autenticación segura y control de acceso basado en roles.

## 📂 Estructura del Proyecto

El proyecto se divide en dos grandes módulos para separar la lógica de negocio de la interfaz de usuario:

### 🖥️ Backend (Node.js & Express)
Organizado de forma modular siguiendo principios de arquitectura limpia:
* **bd/**: Contiene la conexión a Firestore (`conexion.js`) y el CRUD de datos (`usuariosBD.js`).
* **clases/**: Modelos de datos (POJO) con validaciones mediante Setters y Getters (ej. `Usuario.js`).
* **middlewares/**: Lógica de seguridad como encriptación y validación de sesiones (`funcionesPassword.js`).
* **rutas/**: Definición de endpoints de la API (`rutasUsuarios.js`).
* **index.js**: Punto de entrada y configuración de middlewares globales.

### 🎨 Frontend (React + Vite)
Interfaz moderna y eficiente:
* **api/**: Servicios de comunicación con el backend usando Axios.
* **pages/**: Vistas principales de la aplicación (Login, Registro).
* **assets/**: Recursos estáticos y hojas de estilo CSS.
* **App.jsx**: Manejo de rutas y navegación.

## 🛠️ Stack Tecnológico
* **Frontend**: React.js, Vite, React Router, Axios.
* **Backend**: Node.js, Express, Express-Session.
* **Base de Datos**: Firebase Firestore.
* **Seguridad**: Hashing de contraseñas con `crypto.scryptSync`.


## 🚀 Instalación y Configuración

### 1. Credenciales de Firebase
Asegúrate de que el archivo `keys.json` esté ubicado en la raíz principal del proyecto (fuera de las carpetas de frontend y backend).

### 2. Ejecución del Proyecto
Bash

# Terminal 1: Backend
Asegurarse de estar en \hotel-saas-2\backend y ejecutar
```
npm install
npm install express-session
npm install firebase-admin
npm install cors
npm install dotenv
```

Para arrancar el servidor ejecutar
```
node index
```

# Terminal 2: Frontend
**NOTA: ES NECESARIA UNA VERSIÓN ACTUALIZADA DE NODE**
Asegurarse de estar en \hotel-saas-2\frontend y ejecutar
```
npm install
```

Para arrancar el servidor ejecutar
```
npm run dev
```

🔒 Características de Seguridad
Protección de Datos: No se almacenan contraseñas en texto plano; se utiliza un sistema de Hash y Salt único por usuario.

Integridad: Validaciones estrictas en el servidor mediante expresiones regulares para correos, teléfonos y nombres.

Persistencia: Manejo de sesiones seguras que diferencian entre usuarios estándar y administradores.