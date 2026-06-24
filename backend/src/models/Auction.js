const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: 'categoria', // Se usará para diferenciar "Vehicle" y "Tech"
    collection: 'auctions',
    timestamps: true
};

const auctionSchema = new mongoose.Schema({
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Borrador', 'Pendiente', 'Activo', 'Vendido', 'No Vendido'],
        default: 'Borrador'
    },
    tipo: {
        type: String,
        enum: ['Programada', 'Tiempo Real'],
        required: true
    },
    precio_base: {
        type: Number,
        required: true,
        min: 0
    },
    precio_reserva: {
        type: Number,
        required: true,
        min: 0
    },
    fecha_fin: {
        type: Date,
        // Requerido solo si es Programada
        required: function() {
            return this.tipo === 'Programada';
        }
    },
    imagenes: [{
        type: String, // Rutas locales de las imágenes
        required: true
    }]
}, baseOptions);

const Auction = mongoose.model('Auction', auctionSchema);

// Discriminador para Vehículos
const VehicleAuction = Auction.discriminator('Vehicle', new mongoose.Schema({
    vin: {
        type: String,
        required: true
    },
    km: {
        type: Number,
        required: true,
        min: 0
    },
    transmision: {
        type: String,
        enum: ['Manual', 'Automática', 'Semi-automática'],
        required: true
    }
}));

// Discriminador para Tecnología
const TechAuction = Auction.discriminator('Tech', new mongoose.Schema({
    procesador: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    bateria: {
        type: String, // Puede ser capacidad o estado (ej. "100%", "4000mAh")
        required: true
    }
}));

module.exports = { Auction, VehicleAuction, TechAuction };
