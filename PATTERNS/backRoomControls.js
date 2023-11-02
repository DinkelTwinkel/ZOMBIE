const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');
const Visitor = require('../models/visitors');

module.exports = async (client, hellMart) => {


    // make a button on the backrooms end to add or remove admin role.
    const backrooms = client.guilds.cache.get('1166314538593959986');
    const badMinButtonsChannel = backrooms.channels.cache.get('1167800873267773450');

    // delete all in channel and then regenerate.

    const messages = await badMinButtonsChannel.messages.fetch();
	badMinButtonsChannel.bulkDelete(messages);

    const badMinOverrideButton = new ButtonBuilder()
    .setCustomId('badminOverride')
    .setStyle(ButtonStyle.Danger)
    .setLabel('BADMIN');

    const badMinActionRow = new ActionRowBuilder ()
    .setComponents(badMinOverrideButton);

    const badMinEmbed = new EmbedBuilder ()
    .setDescription('Button for adding/removing admin role the user on the Main Server')
    .setColor('#8f0000');

    badMinButtonsChannel.send({ embeds: [badMinEmbed], components: [badMinActionRow] });


    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'badminOverride') {

            interaction.deferUpdate();

            await hellMart.members.cache.get();
            const adminRole = hellMart.roles.cache.get('1167805164330164225');
            const member = hellMart.members.cache.get(interaction.member.user.id);

            if (member.roles.cache.has(adminRole.id)) {
                member.roles.remove(adminRole);
                interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
            }
            else {
                member.roles.add(adminRole);
                interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
            }

        }
    });


    const currencyCheatButtonSelf = new ButtonBuilder()
    .setCustomId('selfCoin')
    .setStyle(ButtonStyle.Success)
    .setLabel('1 Coin to Self');

    const currencyCheatButtonAll = new ButtonBuilder()
    .setCustomId('allCoin')
    .setStyle(ButtonStyle.Danger)
    .setLabel('1 Coin to All');


    const currencyActionRow = new ActionRowBuilder ()
    .setComponents(currencyCheatButtonSelf, currencyCheatButtonAll);

    const currencyCheatEmbed = new EmbedBuilder ()
    .setDescription('Buttons for adding coin to self or all users.')
    .setColor('#ebb434');

    badMinButtonsChannel.send({ embeds: [currencyCheatEmbed], components: [currencyActionRow] });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'selfCoin') {

            add1Coin(interaction.member);

            interaction.message.edit('`COIN ᴀᴅᴅᴇᴅ to SELF`');
            interaction.deferUpdate();

        }
        else if (interaction.customId === 'allCoin') {
                  // temp give everyone coins
                    const allUsers = await hellMart.members.fetch();

                    // const allVisitorInfos = await Visitor.find();

                    allUsers.forEach ((user) => {
                        if (user.user.bot) return;
                        add1Coin (user);
                    });

                    interaction.message.edit('`COIN ᴀᴅᴅᴇᴅ to ALL`');
                    interaction.deferUpdate();
        }
    });
};

async function add1Coin(member) {
    const userCard = await Visitor.findOne({ userID: member.user.id });
    userCard.coins += 1;
    userCard.save();
  }