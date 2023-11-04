// const Visitor = require('../models/visitors');
// const Location = require('../models/location');
const CardBible = require('../models/cardBible');
const { ActionRowBuilder, Events, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = async (hellMart, client) => {

    console.log ('Signin Process Added');

// Page Builder

const paddingTextRight = '₥₳Ɽ₮₥₳Ɽ₮';
const paddingTextLeft = 'ⱧɆⱠⱠⱧɆⱠⱠ';

const signInChannel = await hellMart.channels.cache.get('1167085765809942580');

// find all roles and then apply overwrite to not see this channel.

const roles = await hellMart.roles.fetch();

roles.forEach(role => {
    signInChannel.permissionOverwrites.create(role, { ViewChannel: false });
});
signInChannel.permissionOverwrites.create(signInChannel.guild.roles.everyone, { ViewChannel: true });

const messages = await signInChannel.messages.fetch();
signInChannel.bulkDelete(messages);

// pic random image from database.

const randomCard = await CardBible.aggregate([{ $sample: { size: 1 } }]);

// create buttons

const paddingRight = new ButtonBuilder ()
.setLabel(paddingTextRight)
.setCustomId('paddingRight')
.setStyle(ButtonStyle.Secondary)
.setDisabled(true);

const paddingLeft = new ButtonBuilder ()
.setLabel(paddingTextLeft)
.setCustomId('paddingLeft')
.setStyle(ButtonStyle.Secondary)
.setDisabled(true);

const enterButton = new ButtonBuilder ()
.setLabel('『 ENTER 』')
.setCustomId('enterHell')
.setStyle(ButtonStyle.Danger)
.setDisabled(false);

const enterRow = new ActionRowBuilder ()
.setComponents(paddingLeft, enterButton, paddingRight);

const embed = new EmbedBuilder()
  .setAuthor({
    name: 'Hell Mart.alpha',
    url: 'https://www.hellmart.xyz/',
    iconURL: 'https://cdn.discordapp.com/attachments/1166362435947606068/1166733789855232121/ezgif.com-resize.gif?ex=654b9084&is=65391b84&hm=ed65dd920aa5a7740d8dbe914bbca387abeb3d4d42161357745098d6ee1da7b6&',
  })
  .setDescription('a rogue-like discord server experiment by DinkelZombie')
  .setFooter({
    text: 'card of the day submitted by soul 10',
    iconURL: randomCard[0].imageLink,
  });

// sending

const entryCard = await signInChannel.send({ components: [enterRow], embeds: [embed], files: [{ attachment: randomCard[0].imageLink }] });

// Random Updater for buttons: Flashing and eyes/ fire.

setInterval(() => {
    // update entry card

    const strArrayLeft = paddingTextLeft.split('');
    const strArrayRight = paddingTextRight.split('');

    let newStringLeft = '';

    for (let i = 0; i < strArrayLeft.length; i++) {

        if (Math.random() < 0.3) {
            newStringLeft = newStringLeft.concat('👁');
        }
        else {
            newStringLeft = newStringLeft.concat(strArrayLeft[i]);
        }

    }

    let newStringRight = '';

    for (let i = 0; i < strArrayRight.length; i++) {

        if (Math.random() < 0.3) {
            newStringRight = newStringRight.concat('👁');
        }
        else {
            newStringRight = newStringRight.concat(strArrayRight[i]);
        }

    }

    if (Math.random() < 0.5) {
        if (Math.random() < 0.3) {
            paddingLeft.setLabel(newStringLeft);
        }
        if (Math.random() < 0.3) {
            paddingRight.setLabel(newStringRight);
        }

        enterButton.setLabel(newStringLeft + '『 ENTER 』' + newStringRight);

        enterRow.setComponents(enterButton);
        entryCard.edit ({ components: [enterRow] });

        if (Math.random() < 0.3) {
            paddingLeft.setStyle(ButtonStyle.Danger);
            paddingRight.setStyle(ButtonStyle.Danger);
            enterButton.setStyle(ButtonStyle.Danger);
            enterRow.setComponents(enterButton);
            entryCard.edit ({ components: [enterRow] });

            paddingLeft.setStyle(ButtonStyle.Secondary);
            paddingRight.setStyle(ButtonStyle.Secondary);
            enterButton.setStyle(ButtonStyle.Secondary);
            enterRow.setComponents(enterButton);
            entryCard.edit ({ components: [enterRow] });
        }
    }


}, 300);

// Listener for Button Click

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'enterHell') {

        await interaction.reply({ content: 'w%l!%2 ba2c', ephemeral: true });

        setTimeout(() => {
            interaction.editReply({ content: 'w!lc@m@$ tba 767^', ephemeral: true });
            setTimeout(() => {
                interaction.editReply({ content: 'wel%ome baekl', ephemeral: true });
                setTimeout(() => {
                    interaction.editReply({ content: 'welcome back', ephemeral: true });
                }, 500);
            }, 1000);
        }, 1000);


        setTimeout(() => {

            const roleSet = require('./roleSet');
            roleSet(interaction.member);

            setTimeout(() => {
                interaction.deleteReply();
                sound(interaction.channel);
            }, 666);

        }, 3000);


    }
});

async function sound(channel) {

    const click = await channel.send('click');
    click.delete();
}

};