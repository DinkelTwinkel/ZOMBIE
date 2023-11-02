const Visitor = require('../models/visitors');
// const Backpack = require('../models/backPack');
const numberToWords = require('number-to-words');
const cypherSpeak = require('./cypherSpeak');
const { activeVistorLimit } = require('./Settings/config.json');
// const roleSet = require('./roleSet');
// const startingRaceRoles = ['1166092873389850624', '1166092921217482753', '1166092939483676703'];

module.exports = async (member) => {

    if (member.user.bot) return;

    console.log('Performing conflict check, please hold.');

    const query = { userID: member.user.id };

//     const resultBackpack = await Backpack.findOne(query);

// //     if (resultBackpack) {
// //       console.log('Backpack document already exists: UserID:', resultBackpack.userID);
// //       console.log('Cancelling backpack creation.');
// //     }
// //  else {
// //       const backPack = new Backpack ({
// //         userID: member.user.id,
// //       });
// //       await backPack.save();
// //       console.log('Backpack document created: UserID:', member.user.id);
// //     }


    const result = await Visitor.findOne(query);

    if (result) {
        console.log('Visitor document already exists: UserID:', result.userID);
        console.log('Cancelling document creation.');
        return result.save();
    }
 else {
        console.log('Document does not exist, proceeding with Visitor Card Creation...');
    }

    // Unique Number Selection
    const uniqueNumber = await pickVisitorNumber(member);
    // generate Name

    const raceArray = ['soul'];
    const startingRace = raceArray[Math.floor(Math.random() * raceArray.length)];
    const nameCreation = generateName(startingRace, uniqueNumber);
    console.log ('generated name: ' + nameCreation);

    // Find Role
    // const roleToAssign = await assignRole(member);

    console.log('Adding Database Entry...');

        // Create Database Record.
        const infoCard = new Visitor ({

            number: uniqueNumber,
            userID: member.user.id,
            name: nameCreation,

            raceID: '1166092939483676703',
            level: 0,
            currentXP: 5,
            currentLocation: 0,

            inDungeon: false,

            coins: 10,
            pouchLevel: 0,
            vouchers: 1,

            life: 1,
            lastMessageTime: 0,
            permenantPass: false,

        });

        console.log('Visitor entry added successfully.');

        // add roles + set name

        const owner = await member.guild.fetchOwner();
            if (member === owner) {
                member.send('Hi, I can\'t update your nickname as you are my master. Please do this by hand... new nickname: ' + nameCreation);
            }
            else {
                await member.setNickname(nameCreation);
            }
            // member.roles.add(roleToAssign);

            // announce new arrival

        const announcementChannel = member.guild.channels.cache.get('1165477336985124874');

        cypherSpeak(nameCreation + ' has arrived. . .', announcementChannel, 1000, 1);

            // welcome to ℍ𝔼𝕃𝕃 mart†
        await infoCard.save();

            // roleSet(member);

};

// async function assignRole(member) {
//     console.log ('Searching for Roles with Starting Race Name');
//     const rolesWithMatchingName = await member.guild.roles.cache.filter((role) => role.name === 'whisper');
//     if (rolesWithMatchingName.size === 0) {
//         console.log ('No roles found with that name.');
//       }
//  else {
//         const matchingRolesArray = Array.from(rolesWithMatchingName.values());
//         const roleToAssign = matchingRolesArray[Math.floor(Math.random() * matchingRolesArray.length)];
//         console.log ('Intro Role found... Assigning.');
//         return roleToAssign;
//       }
// }

function obfuscateString(input, chance = 0.5) {
    const obfuscated = input.split('').map((char) => {
      // Determine whether to obfuscate the character
      if (/[a-zA-Z]/.test(char) && Math.random() < chance) {
        const random = Math.random();
        if (random < 0.33) {
          // Replace with a similar-looking number (e.g., 'o' -> '0')
          return char.replace(/[oO]/, '0').replace(/[lL]/, '1').replace(/[eE]/, '3');
        }
 else if (random < 0.66) {
          // Capitalize the letter
          return char.toUpperCase();
        }
 else if (random < 0.7) {
          // Repeat the letter
          return char + char;
        }
 else {
            return char;
        }
      }
      return char;
    });

    return obfuscated.join('');
  }

function generateName(race, numberAssignment) {

    const startingRace = race;

    console.log ('Starting race is: ' + startingRace);
    const nameFirstPart = obfuscateString(startingRace);
    console.log ('First Part of Name: ' + nameFirstPart);

    // Number Identifier
    console.log('Generating Second Part of Name...');

    let nameSecondPart = '';
    nameSecondPart = numberAssignment;
    console.log(numberAssignment);

    // coinFlip for number to word chance.
    const coinFlip = Math.random();
    if (coinFlip > 0.3) {
        console.log('Staying as Numbers');
        nameSecondPart = numberAssignment;
    }
 else {
        console.log('Converting to Words');
        nameSecondPart = obfuscateString(numberToWords.toWords(numberAssignment));
    }

    // Combination
    const nameCreation = nameFirstPart + ' ' + nameSecondPart;
    console.log ('Generated Name is: ' + nameCreation);

    return nameCreation;

}

async function pickVisitorNumber(member) {
    const existingNumbers = await Visitor.distinct('number');
    const allNumbers = Array.from({ length: activeVistorLimit + 1 }, (_, i) => i);
    const availableNumbers = allNumbers.filter((number) => !existingNumbers.includes(number));

    if (availableNumbers.length === 0) {
        member.kick();
        throw new Error('No available numbers in the range, Kicking User');
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomUniqueNumber = availableNumbers[randomIndex];
    console.log ('Available Number found! Assigning: ' + randomUniqueNumber);
    return randomUniqueNumber;
}