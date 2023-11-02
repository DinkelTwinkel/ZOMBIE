const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require('discord.js');
const Visitor = require('../models/visitors');
const Race = require('../models/race');
const Location = require('../models/location');
const Time = require('../models/time');
// const getAllMessagesInChannel = require('../PATTERNS/getAllMessagesInChannel');

module.exports = {
    data: {
      name: 'id',
      description: 'oh mirror, fair mirror',
    },
    async execute(interaction, client) {
      // interaction.reply('Pong!');
      //

      const uniqueRequestAssignment = Date.now() + interaction.member.user.id;

      const playerInfo = await Visitor.findOne({ userID: interaction.member.user.id });
      const playerRace = await Race.findOne({ raceRoleID: playerInfo.raceID });
      const playerLocation = await Location.findOne({ floor: playerInfo.currentLocation });
      const playerTime = await Time.findOne({ userID: interaction.member.user.id });
      console.log(playerInfo);
      console.log(playerRace);
      console.log(playerLocation);

      const toDate = new Date ().getDate();

      if (playerTime.lastXPcapDay != toDate) {
        playerTime.lastXPcapDay = toDate;
        playerInfo.coins += 1;
        // generate new fortune cookie.

        // const newFortune = await getFortuneCookie(client);
        // playerTime.dailyFortune = newFortune;
    }

      await interaction.deferReply({ ephemeral: true });

      const stringParts = [
        {
          string: '\'Mirror\'',
          delay: -100,
        },
        {
          string: '\'Mirror, mirror\'',
          delay: 300,
        },
        {
          string: '\'Mirror, mirror, *who am I?*\'',
          delay: 500,
        },
        {
          string: '**[ IDENTIFY ]** ',
          delay: 1000,
        },
      ];

      let fullMessage = '';

      for (let index = 0; index < stringParts.length; index++) {
        setTimeout(() => {
          fullMessage = stringParts[index].string;
          interaction.editReply({ content: fullMessage });
        }, (1000 * index) + stringParts[index].delay);
      }

      let embed = new EmbedBuilder()
      .addFields(
        {
          name: '\n',
          value: `            You are a『 **${playerRace.raceName.toUpperCase()}** 』` + '\n```' + `'${playerRace.raceDescription}'` + '```',
          inline: true,
        },
        {
          name: '-\n',
          value: '\n',
          inline: true,
        },
        {
          name: '\n',
          value: `『 XP: ${playerInfo.currentXP} 』\n『 Hellions: ${playerInfo.coins} 』\n『 Location: ${playerLocation.locationName} 』\n\n✞ Life: **${playerInfo.life}**`,
          inline: true,
        },
      )
      .setFooter({
        text: `Fortune Cookie: ' ${playerTime.dailyFortune.toLowerCase()} '`,
        // iconURL: 'https://cdn.discordapp.com/attachments/1168219599519633510/1168730839090221056/1450139.png?ex=6552d46a&is=65405f6a&hm=bec8931e867b22f7dcd49cece7072b69a7cd343bc68baa3cf7c2bb1a8b5b0d5b&',
      });

      const showIdentifyButton = new ButtonBuilder ()
      .setCustomId(`showIdentify${uniqueRequestAssignment}`)
      .setLabel('display')
      .setStyle(ButtonStyle.Secondary);

      const identifyActionRow = new ActionRowBuilder ()
      .setComponents(showIdentifyButton);

      setTimeout(() => {
        interaction.editReply ({ embeds: [embed], components: [identifyActionRow] });
      }, 1000 * (stringParts.length + 1));

      client.on(Events.InteractionCreate, async (i) => {

        if (i.customId === `showIdentify${uniqueRequestAssignment}`) {

          embed = new EmbedBuilder()
          .setTitle(`${playerInfo.name}`)
          .addFields(
            {
              name: '\n',
              value: `            You are a『 **${playerRace.raceName.toUpperCase()}** 』` + '\n```' + `'${playerRace.raceDescription}'` + '```',
              inline: true,
            },
            {
              name: '-\n',
              value: '\n',
              inline: true,
            },
            {
              name: '\n',
              value: `『 XP: ${playerInfo.currentXP} 』\n『 Hellions: ${playerInfo.coins} 』\n『 Location: ${playerLocation.locationName} 』\n\n✞ Life: **${playerInfo.life}**`,
              inline: true,
            },
          )
          .setFooter({
            text: `Fortune Cookie: ' ${playerTime.dailyFortune.toLowerCase()} '`,
            // iconURL: 'https://cdn.discordapp.com/attachments/1168219599519633510/1168730839090221056/1450139.png?ex=6552d46a&is=65405f6a&hm=bec8931e867b22f7dcd49cece7072b69a7cd343bc68baa3cf7c2bb1a8b5b0d5b&',
          });

            i.channel.send({ embeds: [embed] });
            i.deferUpdate();
        }

      });

    },
  };

// async function getFortuneCookie(client) {

//   const backRooms = client.guilds.cache.get('1166314538593959986');
//   const cookieChannel = backRooms.channels.cache.get('1167812440533250078');

//   const messages = await getAllMessagesInChannel(cookieChannel);

//   const randomIndex = Math.floor(Math.random() * messages.length);

//   const randomMessage = Array.from(messages)[randomIndex];

//   return randomMessage.content;

// }

