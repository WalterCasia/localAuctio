const express = require('express');
const router = express.Router();
const { placeBid } = require('../controllers/bidController');
const { requireAuth } = require('../middlewares/requireAuth');

router.post('/', requireAuth, placeBid);

module.exports = router;
