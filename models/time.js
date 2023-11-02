const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSchema = new Schema({

    userID: { type: String, unique: true, required: true },
    xpGainedToday: { type: Number, required: true, default: 0 },
    lastXPcapDay: { type: Number, required: true, default: 0 },
    nextResetTime: { type: Number, required: true, default: 0 },
    nextDungeonReset: { type: Number, required: true, default: 0 },
    dailyFortune: { type: String, default: 'try' },

    // put command and skill cooldowns here also.

}, { timestamps: true });

const Time = mongoose.model('time', timeSchema);
module.exports = Time;