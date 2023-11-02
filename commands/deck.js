// const Visitor = require('../models/visitors');

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const Minted = require('../models/cardMinted');

module.exports = {
    data: {
      name: 'deck',
      description: 'It\'s time to DUDUDUUDU-DUEL',
    },
    async execute(interaction, client) {

      const uniqueRequestAssignment = Date.now() + interaction.member.user.id;

      // const tempEmbed = new EmbedBuilder ()
      // .setAuthor({
      //   name: '-opening',
      // });

      // const results = await Minted.find ({ currentOwner: interaction.member.user.id });
      // console.log ('search result ' + results);

      // if (!results) {
      //   return interaction.reply('Sol you have no cards');
      // }
      // else {
      // await interaction.reply ({ embeds: [tempEmbed], ephemeral: true });
      // }

      await interaction.deferReply({ ephemeral: true });


      let currentPage = 0;
      let currentCard = 0;

      editCheck(interaction, currentPage, currentCard, uniqueRequestAssignment);


      client.on(Events.InteractionCreate, async (i) => {
        if (!i.isButton()) return;
        await i.deferUpdate();
        // Listener for Button clicks. //
        // Listener for Page change

        if (i.customId.startsWith(`previousDeckPage${uniqueRequestAssignment}`)) {
          currentPage -= 1;
          currentCard = currentPage * 9;
          editCheck(interaction, currentPage, currentCard, uniqueRequestAssignment);

        }
        else if (i.customId.startsWith(`nextDeckPage${uniqueRequestAssignment}`)) {
          currentPage += 1;
          currentCard = currentPage * 9;
          editCheck(interaction, currentPage, currentCard, uniqueRequestAssignment);

        }

        // Listener for numberSelection

        // extract the number from the custom ID and then editCheck

        if (i.customId.startsWith(`card${uniqueRequestAssignment}`)) {

          const split = i.customId.split(' ');
          currentCard = split[1];

          console.log (currentCard);
          editCheck(interaction, currentPage, currentCard, uniqueRequestAssignment);

        }

        // Listener for Show Card
        if (i.customId.startsWith(`displayCard${uniqueRequestAssignment}`)) {
          const split = i.customId.split(' ');
          const currentCardID = split[1];

          const resultDisplay = await Minted.findOne({ cardID: currentCardID });

          SendUserTheirCard(i, resultDisplay);

        }

        // Listener for Card Deletion

        // Listener to Sell Card

      });

    },
};

function SendUserTheirCard(interaction, card) {

  const date = new Date(card.mintDate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const embed = new EmbedBuilder()
  .setAuthor({
    name: `🃏 ${card.rarity} [${day}/${month}/${year}]`,
  })
  .addFields(
    {
      name: '\n',
      value: `**Power [${card.cardNumber}]  **\ntemplate maker: ${card.creatorName}\n held by: ${interaction.member.nickname}`,
      inline: true,
    },
  )
  .setImage(card.cardImage)
  .setColor('#5c5c5c')
  .setFooter({
    text: card.cardID,
  });

  console.log('Sending Message to: ' + interaction.member.user.id + ' ' + interaction.member.nickname);
  interaction.channel.send({ embeds: [embed], ephemeral: true });


}

async function editCheck(interaction, currentPage, currentCard, uniqueRequestAssignment) {

  console.log (interaction.member.nickname + ' Deck Interaction');

  // Find all the cards a user has.
  const cardsOwned = await Minted.find ({ currentOwner: interaction.member.user.id });

  const cardArray = [];

  cardsOwned.forEach(card => {
    cardArray.push(card);
  });

  const totalPages = Math.ceil (cardArray.length / 9);
  console.log (totalPages);

  const embed = new EmbedBuilder()
  .setTitle('🗃 DECK')
  .setColor('#9C3838')
  .setFooter({
    text: `total cards: ${cardArray.length}`,
  });

  const numberButtons = [];

  // generate all the buttons and push into array.

  const displayButton = new ButtonBuilder()
  .setLabel('SHOW')
  .setStyle(ButtonStyle.Success)
  .setDisabled(false);

  for (let index = 0; index < 10; index++) {

    const cardNumber = index + (currentPage * 9);

    let fieldValue = '';

    const numberButton = new ButtonBuilder()
    .setCustomId(`card${uniqueRequestAssignment} ${cardNumber}`)
    .setLabel(`${cardNumber + 1}`)
    .setStyle(ButtonStyle.Secondary);

    if (!cardArray[index + (currentPage * 9)]) {
      fieldValue = '``';
      numberButton.setLabel('** **');
      numberButton.setDisabled(true);
      displayButton.setCustomId('null');
    }
    else {
      fieldValue = `${cardNumber + 1}.` + '`' + `${cardArray[index + (currentPage * 9)].rarity}` + '`';
      embed.setImage(cardArray[currentCard].cardImage);
      console.log ('current card id: ' + cardArray[currentCard].cardID);
      displayButton.setCustomId(`displayCard${uniqueRequestAssignment} ${cardArray[currentCard].cardID}`);
      if (cardNumber == currentCard) {
        fieldValue = fieldValue.concat('◂');
        numberButton.setStyle(ButtonStyle.Primary);
      }
    }

    console.log ('card number being generated ' + cardNumber);
    console.log ('card number being selected ' + currentCard);


    numberButtons.push(numberButton);
    embed.addFields(
          {
            name: '\n',
            value: `${fieldValue}`,
            inline: true,
          });

  }


  const previousPageButton = new ButtonBuilder()
  .setCustomId(`previousDeckPage${uniqueRequestAssignment} ${currentPage - 1}`)
  .setLabel('◀')
  .setStyle(ButtonStyle.Secondary);
  if (currentPage === 0) previousPageButton.setDisabled(true);

  const nextPageButton = new ButtonBuilder()
  .setCustomId(`nextDeckPage${uniqueRequestAssignment} ${currentPage + 1}`)
  .setLabel('▶')
  .setStyle(ButtonStyle.Secondary);
  if (currentPage === totalPages - 1) nextPageButton.setDisabled(true);

  const sellButton = new ButtonBuilder()
  .setCustomId(`sellCard${uniqueRequestAssignment}`)
  .setLabel('SELL')
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true);

  const discardButton = new ButtonBuilder()
  .setCustomId(`discardCard${uniqueRequestAssignment}`)
  .setLabel('🚮')
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true);

  const pageCounterButton = new ButtonBuilder()
  .setCustomId(`pageCount${uniqueRequestAssignment}`)
  .setLabel(`${currentPage + 1}/${totalPages}`)
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(true);

  const row1 = new ActionRowBuilder ()
    .setComponents(discardButton, numberButtons[0], numberButtons[1], numberButtons[2], sellButton);
    const row2 = new ActionRowBuilder ()
    .setComponents(previousPageButton, numberButtons[3], numberButtons[4], numberButtons[5], nextPageButton);
    const row3 = new ActionRowBuilder ()
    .setComponents(pageCounterButton, numberButtons[6], numberButtons[7], numberButtons[8], displayButton);

  interaction.editReply ({ embeds: [embed], components: [row1, row2, row3] });

}
