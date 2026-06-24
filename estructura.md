Estructura del Proyecto "Auctio" (Entorno Local)Esta es la estructura de carpetas y archivos base para la plataforma de subastas Auctio. Está diseñada siguiendo el patrón MVC para el backend y una arquitectura basada en componentes y contextos para el frontend en React.auctio-proyecto/
│
├── docker-compose.yml        # (Opcional) Script rápido para levantar MongoDB y Redis locales
├── README.md                 # Documentación de tu proyecto
│
├── backend/                  # API Node.js + Express + Socket.io
│   ├── public/
│   │   └── uploads/          # Carpeta donde MULTER guardará las imágenes locales (autos, tech)
│   │
│   ├── src/
│   │   ├── config/           # Configuraciones de conexión
│   │   │   ├── db.js         # Conexión a MongoDB
│   │   │   └── redis.js      # Conexión a Redis y carga del Script LUA
│   │   │
│   │   ├── models/           # Esquemas de Base de Datos (Mongoose)
│   │   │   ├── User.js       # Usuario (con saldo_deudor, rol_preferido)
│   │   │   ├── Auction.js    # Subasta (con Discriminadores para Vehículos vs Tech)
│   │   │   └── Bid.js        # Historial persistente de pujas
│   │   │
│   │   ├── controllers/      # Lógica de las peticiones HTTP
│   │   │   ├── authController.js    # Login y Registro (JWT/Bcrypt)
│   │   │   ├── auctionController.js # CRUD subastas, filtros y búsquedas
│   │   │   └── bidController.js     # Procesamiento de pujas en vivo
│   │   │
│   │   ├── middlewares/      # Interceptores de Express
│   │   │   ├── requireAuth.js       # Verifica el token JWT
│   │   │   └── uploadMiddleware.js  # Configuración de Multer para las 5 imágenes
│   │   │
│   │   ├── services/         # Lógica de Negocio Crítica
│   │   │   └── redisBidService.js   # Ejecución del Script de Lua en memoria
│   │   │
│   │   ├── sockets/          # Lógica de Tiempo Real
│   │   │   └── socketHandler.js     # Gestión de conexiones y salas (Lanes)
│   │   │
│   │   ├── routes/           # Definición de Endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── auctionRoutes.js
│   │   │   └── bidRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   └── auctionCron.js       # Tarea programada para cerrar subastas expiradas
│   │   │
│   │   ├── app.js            # Instancia de Express y middlewares globales (CORS, JSON)
│   │   └── server.js         # Punto de entrada: Levanta HTTP, conecta BD y Socket.io
│   │
│   ├── .env                  # Variables locales (PORT=5000, JWT_SECRET, MONGO_URI)
│   └── package.json          # Dependencias (express, mongoose, multer, jsonwebtoken...)
│
└── frontend/                 # Aplicación React.js (Vite)
    ├── public/
    ├── src/
    │   ├── assets/           # Iconos, imágenes estáticas
    │   │
    │   ├── components/       # Componentes visuales
    │   │   ├── ui/           # Botones, Inputs, Modales genéricos
    │   │   ├── auction/      # Tarjetas de subastas, Galería de fotos (Miniaturas/Carrusel)
    │   │   └── layout/       # Navbar (con el botón Switch de Roles)
    │   │
    │   ├── context/          # Estado Global
    │   │   ├── AuthContext.jsx  # Guarda el JWT y los datos del usuario logueado
    │   │   └── RoleContext.jsx  # Controla si la vista es Subastador o Comprador
    │   │
    │   ├── hooks/            # Funciones personalizadas
    │   │   └── useSocket.js  # Conexión al servidor de WebSockets
    │   │
    │   ├── pages/            # Vistas de la aplicación
    │   │   ├── Home.jsx             # Landing Page
    │   │   ├── LoginRegister.jsx    # Formulario de autenticación
    │   │   ├── Dashboard.jsx        # Buscador y listas de subastas
    │   │   ├── CreateAuction.jsx    # Formulario dinámico (Subastador)
    │   │   ├── LiveAuction.jsx      # Sala en vivo (Carril / Lane)
    │   │   └── Profile.jsx          # Perfil, Saldo deudor y configuraciones
    │   │
    │   ├── services/
    │   │   └── api.js        # Configuración de Axios apuntando a http://localhost:5000
    │   │
    │   ├── App.jsx           # Enrutador principal (React Router)
    │   └── main.jsx          # Punto de entrada de React
    │
    ├── .env                  # Variables locales (VITE_API_URL=http://localhost:5000)
    ├── vite.config.js
    └── package.json
