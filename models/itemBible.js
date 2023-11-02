const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemBibleSchema = new Schema({

	customID: { type: String, required: true, unique: true },
	itemName: { type: String, required: true, unique: false },
	itemDescription: { type: String, required: true, unique: false },

	rarity: { type: String, required: true },
	creatorName: { type: String, default: 'unknown' },
	itemType: { type: String, default: 'collectible' },
	creationDate: { type: Number, required: true },

	stat: { type: Number, default: 0 },
	skillConferred: { type: String, default: 'none', unique: false },

}, { timestamps: true });

const ItemBible = mongoose.model('mintedItem', itemBibleSchema);
module.exports = ItemBible;