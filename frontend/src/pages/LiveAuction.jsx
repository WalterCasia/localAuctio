import React, { useEffect, useState } from 'react';
import LiveAuctionRoom from '../components/auction/LiveAuctionRoom';
import api from '../services/api';

const LiveAuction = () => {
    // Para simplificar esta demo, simularemos obtener la subasta más reciente activa 
    // O puedes pasar un ID por URL si usamos react-router useParams
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const { data } = await api.get('/auctions/search');
                if (data.length > 0) {
                    setAuction(data[0]); // Mostramos la primera por defecto
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Cargando subasta...</div>;
    if (!auction) return <div style={{ padding: '2rem' }}>No hay subastas activas disponibles.</div>;

    return (
        <div>
            <LiveAuctionRoom auction={auction} />
        </div>
    );
};

export default LiveAuction;
