const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    subasta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    monto: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
