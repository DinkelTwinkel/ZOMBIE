const { Events } = require('discord.js');
const Time = require('../models/time');
const xpGain = require('./xpGain');

module.exports = async (client) => {

    const decayTime = 24;

	client.on(Events.InteractionCreate, async (interaction) => {

        if (interaction.member.bot) return;

        const now = new Date();
        // Add 24 hours to the current date and time
        now.setUTCHours(now.getUTCHours() + decayTime);
        // Get the UTC milliseconds for the date 24 hours from now
        const utcMilliseconds = now.getTime();

		// member clicked a button or used a command.
        let memberTime = await Time.findOne ({ userID: interaction.member.user.id });

        if (!memberTime) {
            memberTime = new Time({
                userID: interaction.member.user.id,
                xpGainedToday: 0,
                lastXPcapDay: 0,
                nextResetTime: 0,
                nextDungeonReset: 0,
            });
        }

        memberTime.nextResetTime = utcMilliseconds;
        await memberTime.save();

        // console.log (`Button click detected. Updating ${interaction.member.nickname} to ${now.getDate()}`);

        // give player xp for the button clicks.

        xpGain(interaction.member, 1, client);

    });

    client.on(Events.MessageCreate, async (message) => {

        if (message.member.user.bot) return;

        const now = new Date();
        // Add 24 hours to the current date and time
        now.setUTCHours(now.getUTCHours() + decayTime);
        // Get the UTC milliseconds for the date 24 hours from now
        const utcMilliseconds = now.getTime();

		// member clicked a button or used a command.
        const memberTime = await Time.findOne ({ userID: message.member.user.id });

        memberTime.nextResetTime = utcMilliseconds;
        await memberTime.save();


        // console.log (`Message detected. Updating ${message.member.nickname} to ${now.getDate()}`);

        // give player xp for their message.

        xpGain(message.member, 1, client);

    });

};