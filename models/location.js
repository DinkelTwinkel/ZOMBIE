const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({

  floor: { type: Number, required: true, unique: true },
  locationName: { type: String, required: true },
  locationChannelIDs: [{ type: String, default: null }],
  locationAccessRoleID: { type: String, default: null, unique: false },
  requireKey: { type:  Boolean, required: true },
  keyID: [{ type: String, required: false }],
  requirePassword: { type:  Boolean, required: true },
  password: { type: String, unique: true },
  dynamic: { type:  Boolean, required: true, default: true },
  dynamicChannels: [
		{
			channelName: { type: String, required: true },
			type: { type: String, required: true },
      parent: { type: String, required: true },
      description: { type: String, required: true },
		},
	],
  dynamicRoleName: { type: String },
  active: { type: Boolean, required: true, default: false },

}, { timestamps: true });

const Location = mongoose.model('location', locationSchema);
module.exports = Location;