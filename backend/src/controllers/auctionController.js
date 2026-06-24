const { Auction, VehicleAuction, TechAuction } = require('../models/Auction');

// @desc    Crear una nueva subasta
// @route   POST /api/auctions
// @access  Private (Subastador)
const createAuction = async (req, res) => {
    try {
        // Verificar que el usuario tenga rol de Subastador
        if (req.user.rol_preferido !== 'Subastador') {
            return res.status(403).json({ message: 'Solo los subastadores pueden crear subastas' });
        }

        // Multer procesa las imágenes en req.files
        if (!req.files || req.files.length < 5) {
            return res.status(400).json({ message: 'Se requiere un mínimo de 5 imágenes.' });
        }

        const imagenesPath = req.files.map(file => `/uploads/auctions/${file.filename}`);

        const {
            titulo,
            descripcion,
            tipo,
            precio_base,
            precio_reserva,
            fecha_fin,
            categoria, // 'Vehicle' o 'Tech'
            ...dynamicFields
        } = req.body;

        const baseData = {
            vendedor: req.user._id,
            titulo,
            descripcion,
            tipo,
            precio_base,
            precio_reserva,
            fecha_fin,
            imagenes: imagenesPath
        };

        let nuevaSubasta;

        if (categoria === 'Vehicle') {
            nuevaSubasta = await VehicleAuction.create({
                ...baseData,
                vin: dynamicFields.vin,
                km: dynamicFields.km,
                transmision: dynamicFields.transmision
            });
        } else if (categoria === 'Tech') {
            nuevaSubasta = await TechAuction.create({
                ...baseData,
                procesador: dynamicFields.procesador,
                ram: dynamicFields.ram,
                bateria: dynamicFields.bateria
            });
        } else {
            return res.status(400).json({ message: 'Categoría no válida. Debe ser "Vehicle" o "Tech".' });
        }

        res.status(201).json({
            message: 'Subasta creada con éxito',
            auction: nuevaSubasta
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Buscar subastas activas
// @route   GET /api/auctions/search
// @access  Public
const searchAuctions = async (req, res) => {
    try {
        const { tipo, categoria } = req.query;
        let query = { estado: 'Activo' };

        if (tipo) {
            query.tipo = tipo;
        }

        if (categoria) {
            query.categoria = categoria; 
        }

        // Ordenamos por precio_base de menor a mayor para "Destacados"
        const auctions = await Auction.find(query).sort({ precio_base: 1 });

        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAuction, searchAuctions };
