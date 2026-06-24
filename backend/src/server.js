const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { initSocket } = require('./sockets/socketHandler');
const { loadScript } = require('./services/redisBidService');
const { initCron } = require('./utils/auctionCron');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Levantar el servidor y conectar servicios
const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();
        
        const server = http.createServer(app);
        
        // Configurar Socket.io
        initSocket(server);

        // Pre-cargar Lua Script en Redis
        await loadScript();

        // Iniciar el Cron Job
        initCron();
        
        server.listen(PORT, () => {
            console.log(`Servidor de Auctio corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
