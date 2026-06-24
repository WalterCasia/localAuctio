const { placeBidAtomic } = require('../services/redisBidService');
const { getIo } = require('../sockets/socketHandler');
const Bid = require('../models/Bid');

// @desc    Realizar una puja en tiempo real
// @route   POST /api/bids
// @access  Private (Compradores)
const placeBid = async (req, res) => {
    try {
        const { subastaId, monto } = req.body;
        const userId = req.user._id;

        // Regla de Negocio: Sólo compradores pueden pujar
        if (req.user.rol_preferido !== 'Comprador') {
            return res.status(403).json({ message: 'Solo los compradores pueden pujar' });
        }

        if (!subastaId || !monto) {
            return res.status(400).json({ message: 'Falta subastaId o monto' });
        }

        // 1. Ejecutar el script LUA de Redis (Validación Atómica)
        const isSuccess = await placeBidAtomic(subastaId, userId, monto);

        if (!isSuccess) {
            return res.status(400).json({ message: 'Puja rechazada. El monto debe ser mayor a la oferta actual.' });
        }

        // 2. Si Redis aprueba (1), emitir evento por Socket.io
        const io = getIo();
        io.to(`auction_${subastaId}`).emit('new_bid', {
            subastaId,
            userId,
            monto,
            timestamp: new Date()
        });

        // 3. Persistencia asíncrona (Fire & Forget)
        Bid.create({
            subasta: subastaId,
            usuario: userId,
            monto
        }).catch(err => {
            console.error('Error guardando historial de puja asíncrona:', err);
        });

        res.status(200).json({
            message: 'Puja aceptada y registrada con éxito',
            montoLeader: monto
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeBid };
