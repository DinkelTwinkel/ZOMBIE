const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mintedSchema = new Schema({

	cardID: { type: String, required: true, unique: true },

	cardNumber: { type: Number, default: 0 },
	creatorName: { type: String, required: true },
	bibleReference: { type: Number, required: true },
	cardImage: { type: String },

	mintDate: { type: Number, required: true },
	rarity: { type: String, required: true },

	currentOwner: { type: String, required: true },

}, { timestamps: true });

const Minted = mongoose.model('mintedCard', mintedSchema);
module.exports = Minted;