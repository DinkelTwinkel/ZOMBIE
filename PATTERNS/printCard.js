const CardBible = require ('../models/cardBible');
const CardMinted = require ('../models/cardMinted');
// const Backpack = require ('../models/backPack');
const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction, selectedItemType, selectedQuantity) => {

    console.log ('Attemping to Print Cards');

    const cardsInType = Array.from(await CardBible.find({ channelID: selectedItemType }));

    const mintedCards = [];

    for (let index = 0; index < selectedQuantity; index++) {

        const randomCardDraw = cardsInType[Math.floor(Math.random() * cardsInType.length)];

        const pool = [];

        console.log ('ADDING ALL AVAILABLE LIMITS TO POOL');

        const hellRoll = randomCardDraw.hellLimit - randomCardDraw.hellCount;
        for (let i = 0; i < hellRoll; i++) {
            pool.push('HELL');
        }

        const legendaryRoll = randomCardDraw.LegendaryLimit - randomCardDraw.LegendaryCount;
        for (let i = 0; i < legendaryRoll; i++) {
            pool.push('LEGENDARY');
        }

        const mythicRoll = randomCardDraw.mythicLimit - randomCardDraw.mythicCount;
        for (let i = 0; i < mythicRoll; i++) {
            pool.push('MYTHIC');
        }

        const dragonBoneRoll = randomCardDraw.dragonBoneLimit - randomCardDraw.dragonBoneCount;
        for (let i = 0; i < dragonBoneRoll; i++) {
            pool.push('DRAGONBONE');
        }

        const darkSteelRoll = randomCardDraw.darkSteelLimit - randomCardDraw.darkSteelCount;
        for (let i = 0; i < darkSteelRoll; i++) {
            pool.push('DARKSTEEL');
        }

        const ironwoodRoll = randomCardDraw.ironwoodLimit - randomCardDraw.ironwoodCount;
        for (let i = 0; i < ironwoodRoll; i++) {
            pool.push('IRONWOOD');
        }

        const ratBoneRoll = randomCardDraw.ratBoneLimit - randomCardDraw.ratBoneCount;
        for (let i = 0; i < ratBoneRoll; i++) {
            pool.push('RATBONE');
        }

        const randomRarity = pool[Math.floor(Math.random() * pool.length)];

        console.log('Chosen Rarity is: ' + randomRarity);

        const increaseCount = CardBible.findOne({ messageId: randomCardDraw.messageId });

        if (randomRarity === 'RATBONE') {
            increaseCount.ratBoneCount = increaseCount.ratBoneCount + 1;
        }
 else if (randomRarity === 'IRONWOOD') {
            increaseCount.ironwoodCount = increaseCount.ironwoodCount + 1;
        }
 else if (randomRarity === 'DARKSTEEL') {
            increaseCount.darkSteelCount = increaseCount.darkSteelCount + 1;
        }
 else if (randomRarity === 'DRAGONBONE') {
            increaseCount.dragonBoneCount = increaseCount.dragonBoneCount + 1;
        }
 else if (randomRarity === 'MYTHIC') {
            increaseCount.mythicCount = increaseCount.mythicCount + 1;
        }
 else if (randomRarity === 'LEGENDARY') {
            increaseCount.LegendaryCount = increaseCount.LegendaryCount + 1;
        }
 else if (randomRarity === 'HELL') {
            increaseCount.hellCount = increaseCount.hellCount + 1;
        }

        // await increaseCount.save();

        // n = db.myCollection.find({"id": { "$lt" : 12345}}).count() ;
        const now = Date.now();

        const min = -10;
        const max = 10;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;

        const cardID = `${now}-${randomCardDraw.creatorId}-${index}`;

        const mintedCard = new CardMinted ({
            cardID: cardID,
            cardNumber: random,
            bibleReference: randomCardDraw.messageId,
            creatorName: randomCardDraw.creatorName,
            mintDate: now,
            rarity: randomRarity,
            currentOwner: interaction.member.user.id,
            cardImage: randomCardDraw.imageLink,
        });

        await mintedCard.save();

        mintedCards.push(mintedCard);

        // const result = await Backpack.updateOne(
        //     { userID: interaction.member.user.id }, // Replace with the filter to find the document
        //     { $push: { cardDeck: cardID } } // Replace 'myArray' with the name of your array field
        //   );

    }

    mintedCards.forEach ((card) => {
        console.log(card.cardID);
    });

    CardReveal(mintedCards, interaction);

};

async function CardReveal(cardCollection, interaction) {

    const revealSpeed = 2000;

    const revealing = '⣿⣿⣿⣿⣿⣿..OPENING...⣿⣿⣿⣿⣿⣿';
    const block = '⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿';

    const numRows = cardCollection.length;

    let receipt = '\n';

    for (let i = 0; i < numRows; i++) {
        receipt = receipt.concat(block, '\n');
    }

    interaction.editReply(receipt);

     for (let index = 0; index < cardCollection.length; index++) {

        setTimeout(() => {

        receipt = '\n';

        const hidden = cardCollection.length - index - 1;

        for (let i = 0; i < index; i++) {
            receipt = receipt.concat('🃏 ', cardCollection[i].rarity, '\n');
        }

        receipt = receipt.concat(revealing, '\n');

        for (let i = 0; i < hidden; i++) {
            receipt = receipt.concat(block, '\n');
        }

        console.log (receipt);

        interaction.editReply(receipt);

        setTimeout(() => {
            SendUserTheirCard(interaction, cardCollection[index]);
        }, 1000);

        }, index * revealSpeed);

    }

    console.log (receipt);

    setTimeout(() => {
        receipt = '\n';
        for (let i = 0; i < numRows; i++) {
            receipt = receipt.concat('🃏 ', cardCollection[i].rarity, '\n');
        }
        interaction.editReply(receipt);
    }, cardCollection.length * revealSpeed);


}

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
    interaction.followUp({ embeds: [embed], ephemeral: true });


}