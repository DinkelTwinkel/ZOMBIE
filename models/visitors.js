const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorSchema = new Schema({

  number: { type: Number, required: true, unique: true },
  userID: { type: String, required: true, unique: true },

  name: { type: String, required: true, unique: true },

  raceID: { type: String, required: true },
  level: { type: Number, required: true, default: 0 },
  currentXP: { type: Number, required: true, default: 0 },
  currentLocation: { type: String, required: true },

  inDungeon: { type: Boolean, default: false },

  coins: { type: Number, required: true, default: 0 },
  pouchLevel: { type: Number, required: true, default: 0 },
  vouchers:  { type: Number, required: true, default: 0 },

  learnedSkills: [{ type: String }],
  conferredSkills: [{ type: String }],

  life: { type: Number, default: 5 },
  lastMessageTime: { type: Number, default: 0 },
  permenantPass: { type: Boolean, default: false },

}, { timestamps: true });

const Visitor = mongoose.model('visitor', visitorSchema);
module.exports = Visitor;