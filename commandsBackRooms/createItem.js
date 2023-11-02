const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ItemBible = require('../models/itemBible');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createitem')
    .setDescription('create a new item for the server')
    .addStringOption(option =>
      option
        .setName('customid')
        .setDescription('must be unique')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('name of new item')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('flavor text')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('rarity')
        .setDescription('rarity of object')
        .setRequired(true)
        .addChoices(
					{ name: 'common', value: 'common' },
					{ name: 'uncommon', value: 'uncommon' },
					{ name: 'rare', value: 'rare' },
          { name: 'mythic', value: 'mythic' },
          { name: 'legendary', value: 'legendary' },
          { name: 'hell', value: 'hell' },
				))
    .addStringOption(option =>
      option
        .setName('itemtype')
        .setDescription('type of item')
        .setRequired(true)
        .addChoices(
          { name: 'food', value: 'food' },
          { name: 'weapon', value: 'weapon' },
          { name: 'armour', value: 'armour' },
          { name: 'tool', value: 'tool' },
          { name: 'skillbook', value: 'skillbook' },
          { name: 'collectible', value: 'collectible' },
          { name: 'key', value: 'key' },
        ))
    .addIntegerOption(option =>
      option
        .setName('stat')
        .setDescription('whatever state the item type conveys')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('skillconferred')
        .setDescription('skill given to user when in posession or equipped')
        .setRequired(true)
        .addChoices(
          { name: 'none', value: 'none' },
        ))
    .addStringOption(option =>
      option
        .setName('creatorname')
        .setDescription('flavor text')
        .setRequired(false)),

    async execute(interaction) {

      console.log (interaction.member.nickname + ' opened inventory.');

      // We NEED some data on items.
      // item name, rarity/ Creator Name / item type, creation date, stat, skill conferred.

      // if custom id already exist, add 1, and loop again to check and if still exist loop again.

      let foundEmptyCustomID = false;
      let itemCustomID = '';
      let index = 0;

      await interaction.deferReply();

      while (foundEmptyCustomID === false) {

        itemCustomID = interaction.options.getString('customid') + index;
        console.log(itemCustomID);

        const result = await ItemBible.findOne({ customID: itemCustomID });

        console.log(result);

        if (result === null) {
          foundEmptyCustomID = true;
        }
        else {
          index += 1;
        }

      }

      const newItem = new ItemBible({

        customID: itemCustomID,
        itemName: interaction.options.getString('name'),
        itemDescription: interaction.options.getString('description'),
        rarity: interaction.options.getString('rarity'),
        type: interaction.options.getString('type'),

        creatorName: interaction.options.getString('creatorname'),
        itemType: interaction.options.getString('itemtype'),

        creationDate: Date.now(),
        stat: interaction.options.getInteger('stat'),
        skillConferred: interaction.options.getString('skillconferred'),

      });

      newItem.save();

      const confirmationEmbed = new EmbedBuilder()
      .addFields(
        {
          name: '\n',
          value: `            item created:『 **${newItem.itemName}** 』` + '\n```' + `'${newItem.itemDescription}'` + '```',
          inline: true,
        },
        {
          name: '-\n',
          value: '\n',
          inline: true,
        },
        {
          name: '\n',
          value: `『 type: ${newItem.itemType} 』\n『 creator: ${newItem.creatorName} 』\n『 stat: ${newItem.stat} 』\n\n✞ RARITY: **${newItem.rarity}**`,
          inline: true,
        },
      )
      .setFooter({
        text: `CustomID: ' ${newItem.customID} '`,
      });

      interaction.editReply({ embeds: [confirmationEmbed] });


    },
  };

