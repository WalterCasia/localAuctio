const cron = require('node-cron');
const { Auction } = require('../models/Auction');
const { closeAuction } = require('./closeAuction');

const initCron = () => {
    // Ejecutar cada minuto
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            // Buscar subastas Programadas, Activas y expiradas
            const expiredAuctions = await Auction.find({
                tipo: 'Programada',
                estado: 'Activo',
                fecha_fin: { $lte: now }
            });

            for (const auction of expiredAuctions) {
                await closeAuction(auction._id);
            }

            if (expiredAuctions.length > 0) {
                console.log(`Cron: ${expiredAuctions.length} subastas programadas cerradas automáticamente.`);
            }
        } catch (error) {
            console.error('Error en cron de subastas:', error);
        }
    });

    console.log('Cron Job de Subastas Inicializado');
};

module.exports = { initCron };
