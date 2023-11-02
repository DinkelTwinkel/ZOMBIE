const numberToWords = require('number-to-words');

module.exports = async (race, numberAssignment) => {

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

};

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
