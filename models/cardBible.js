const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardBibleSchema = new Schema({

  messageId: { type: Number, required: true, unique: true },
  imageLink: { type: String, required: true },
  channelID: { type: String, required: true },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  hellLimit: { type: Number, default: 1 },
  hellCount: { type: Number, default: 0 },
  LegendaryLimit: { type: Number, default: 1 },
  LegendaryCount: { type: Number, default: 0 },
  mythicLimit: { type: Number, default: 2 },
  mythicCount: { type: Number, default: 0 },
  dragonBoneLimit: { type: Number, default: 10 },
  dragonBoneCount: { type: Number, default: 0 },
  darkSteelLimit: { type: Number, default: 60 },
  darkSteelCount: { type: Number, default: 0 },
  ironwoodLimit: { type: Number, default: 100 },
  ironwoodCount: { type: Number, default: 0 },
  ratBoneLimit: { type: Number, default: 826 },
  ratBoneCount: { type: Number, default: 0 },

  enabled: { type: Boolean, default: true },

}, { timestamps: true });

const CardBible = mongoose.model('cardBible', cardBibleSchema);
module.exports = CardBible;