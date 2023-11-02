const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({

	// unique ID to each item Object, only one of each.
	itemID: { type: String, required: true, unique: true },

	// quality assignment, also unique to each item
	itemQuality: { type: Number, default: 0 },

	// storing who first found this item.
	finderName: { type: String, default: 'unknown' },

	// referencing to the bible verse.
	bibleReference: { type: Number, required: true },

	dateFound: { type: Number, required: true },
	currentOwner: { type: String, required: true },

}, { timestamps: true });

const Item = mongoose.model('mintedItem', itemSchema);
module.exports = Item;