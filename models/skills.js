const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({

	customID: { type: String, required: true, unique: true },

	skillTitle: { type: String, required: true, unique: false },

	skillDescription: { type: String, required: true },

	discovererName: { type: String, default: 'unknown' },
	creationDate: { type: Number, required: true },

	coolDown: { type: Number, default: 0 },

	level: { type: Number, default: 0 },

}, { timestamps: true });

const skillBible = mongoose.model('mintedItem', skillSchema);
module.exports = skillBible;