import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import useSocket from '../../hooks/useSocket';
import api from '../../services/api';

const LiveAuctionRoom = ({ auction }) => {
    const { user } = useAuth();
    const { currentView } = useRole();
    const [currentBid, setCurrentBid] = useState(auction.precio_base);
    const [bidAmount, setBidAmount] = useState('');
    const [mainImage, setMainImage] = useState(auction.imagenes?.[0]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Hook personalizado para escuchar WebSockets en tiempo real
    useSocket(auction._id, (newBidData) => {
        setCurrentBid(newBidData.monto);
    });

    const handleBid = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (currentView !== 'Comprador') {
            setError('Debes cambiar al modo Comprador para pujar.');
            return;
        }

        const amountToBid = parseFloat(bidAmount);
        if (amountToBid <= currentBid) {
            setError('Tu puja debe ser mayor a la oferta actual.');
            return;
        }

        try {
            const res = await api.post('/bids', {
                subastaId: auction._id,
                monto: amountToBid
            });
            setSuccess('¡Puja realizada con éxito!');
            setBidAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al pujar');
        }
    };

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    return (
        <div className="glass-panel" style={{ maxWidth: '900px', margin: '2rem auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Galería Visual */}
            <div style={{ flex: '1 1 400px' }}>
                <div style={{ 
                    width: '100%', 
                    height: '300px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    marginBottom: '1rem',
                    background: '#000'
                }}>
                    <img 
                        src={`${API_BASE}${mainImage}`} 
                        alt="Subasta Principal" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {auction.imagenes?.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setMainImage(img)}
                            style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '8px', 
                                overflow: 'hidden', 
                                cursor: 'pointer',
                                border: mainImage === img ? '2px solid var(--primary)' : '2px solid transparent'
                            }}
                        >
                            <img src={`${API_BASE}${img}`} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel de Información y Puja */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{auction.titulo}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{auction.descripcion}</p>
                
                <div style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '2rem',
                    borderLeft: '4px solid var(--accent)'
                }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>OFERTA LÍDER ACTUAL</p>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: '0.5rem 0' }}>
                        ${currentBid}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Finaliza: {auction.tipo === 'Programada' ? new Date(auction.fecha_fin).toLocaleString() : 'Subasta en Vivo'}
                    </p>
                </div>

                {/* Panel Interactivo de Puja */}
                {user ? (
                    <form onSubmit={handleBid} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        {error && <div style={{ color: '#ef4444' }}>{error}</div>}
                        {success && <div style={{ color: '#22c55e' }}>{success}</div>}
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="number" 
                                className="input-field" 
                                placeholder={`Mínimo: $${currentBid + 1}`}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                style={{ margin: 0, flex: 1 }}
                                required
                            />
                            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                Pujar Rápido
                            </button>
                        </div>
                    </form>
                ) : (
                    <button 
                        className="btn-primary" 
                        onClick={() => window.location.href = '/'}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        Register to Bid
                    </button>
                )}
            </div>
        </div>
    );
};

export default LiveAuctionRoom;
