const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado Socket.io: ${socket.id}`);

        // Usuario se une a una sala de subasta (Lane)
        socket.on('join_auction', (auctionId) => {
            socket.join(`auction_${auctionId}`);
            console.log(`Socket ${socket.id} unido a subasta ${auctionId}`);
        });

        // Usuario abandona la sala
        socket.on('leave_auction', (auctionId) => {
            socket.leave(`auction_${auctionId}`);
            console.log(`Socket ${socket.id} abandonó subasta ${auctionId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io no está inicializado');
    }
    return io;
};

module.exports = { initSocket, getIo };
