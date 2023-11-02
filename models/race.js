/* eslint-disable no-inline-comments */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raceSchema = new Schema({

    raceName: { type: String, required: true, unique: true },
    raceRoleID: { type: String, required: true, unique: true },
    raceDescription: { type: String, required: true },
    raceMaxLife: { type: Number, required: true },
    baseStrength: { type: Number, required: true },

    skills: [
        {
            skillId: { type: String, required: true }, // Skill ID
            coolDown: { type: Number, default: 0 }, // Skill Cooldown
        },
    ],

    nextEvolutionOptions: [{ type: String }],
    nextEvolutionXPrequirement: [{ type: Number, required: true }],
    nextEvolutionRequireditems: [
        {
            itemId: { type: String, required: true }, // Item ID
            quantity: { type: Number, default: 0 }, // Item quantity
        },
    ],

}, { timestamps: true });

const Race = mongoose.model('race', raceSchema);
module.exports = Race;