const express = require('express');
const router = express.Router();
const { createAuction, searchAuctions } = require('../controllers/auctionController');
const { requireAuth } = require('../middlewares/requireAuth');
const upload = require('../middlewares/uploadMiddleware');

// Rutas públicas
router.get('/search', searchAuctions);

// Protegemos la ruta de creación con requireAuth
// El campo debe llamarse 'imagenes', permitiendo hasta un límite razonable (ej. 10)
router.post('/', requireAuth, upload.array('imagenes', 10), createAuction);

module.exports = router;
