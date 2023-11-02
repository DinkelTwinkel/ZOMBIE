const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendingCoinSchema = new Schema({

    userID: { type: String, required: true, unique: true },
    coinsInMachine: { type: Number, default: 0 },

}, { timestamps: true });

const VendingCoins = mongoose.model('vendingCoin', vendingCoinSchema);
module.exports = VendingCoins;