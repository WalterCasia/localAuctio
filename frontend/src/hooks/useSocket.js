import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const useSocket = (auctionId, onNewBid) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Inicializar socket
        socketRef.current = io(SOCKET_URL);

        // Unirse a la sala de la subasta
        socketRef.current.emit('join_auction', auctionId);

        // Escuchar nuevos bids
        socketRef.current.on('new_bid', (data) => {
            if (onNewBid) {
                onNewBid(data);
            }
        });

        // Limpieza al desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_auction', auctionId);
                socketRef.current.disconnect();
            }
        };
    }, [auctionId]); // Se re-ejecuta solo si cambia el ID de la subasta

    return socketRef.current;
};

export default useSocket;
