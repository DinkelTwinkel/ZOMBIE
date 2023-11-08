const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelWhitelistSchema = new Schema({

	channelID: { type: String, required: true, unique: true },
	channelName: { type: String, required: true, unique: false },

}, { timestamps: true });

const channelWhitelist = mongoose.model('channelWhitelist', channelWhitelistSchema);
module.exports = channelWhitelist;