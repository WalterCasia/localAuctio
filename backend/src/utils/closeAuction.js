const { Auction } = require('../models/Auction');
const User = require('../models/User');
const { client } = require('../config/redis');

const closeAuction = async (auctionId) => {
    try {
        const auction = await Auction.findById(auctionId);
        if (!auction || auction.estado !== 'Activo') return;

        // Buscar puja máxima en Redis (Hash de la subasta)
        const maxBidInfo = await client.hGetAll(`auction:${auctionId}`);
        const maxMonto = parseFloat(maxBidInfo.monto || 0);
        const winnerUserId = maxBidInfo.usuario;

        if (maxMonto >= auction.precio_reserva && winnerUserId) {
            auction.estado = 'Vendido';
            await auction.save();

            // Sumar deuda al comprador ganador
            const winner = await User.findById(winnerUserId);
            if (winner) {
                winner.saldo_deudor += maxMonto;
                await winner.save();
            }
            console.log(`Subasta ${auctionId} Vendida a ${winnerUserId} por $${maxMonto}`);
        } else {
            auction.estado = 'No Vendido';
            await auction.save();
            console.log(`Subasta ${auctionId} No Vendida. No alcanzó el precio de reserva.`);
        }
    } catch (error) {
        console.error(`Error al cerrar subasta ${auctionId}:`, error);
    }
};

module.exports = { closeAuction };
