module.exports = async (textToDeliver, channelToSend, shiftSpeed, formatIndex) => {

    const textShiftTime = shiftSpeed;
    let currentLetterToShift = 0;
    const deliveryLength = textToDeliver.length;


    channelToSend.send(applyFormatting(cypherText(textToDeliver.length), formatIndex)).then((deliveryMessage) => {

    while (currentLetterToShift <= deliveryLength) {

                const codedText = cypherText(textToDeliver.length);
                const backOfPayload = codedText.slice(currentLetterToShift);

                let frontOfPayLoad = '';
                for (let i = 0; i < currentLetterToShift; i++) {
                    frontOfPayLoad += textToDeliver.charAt(i);
                }
                const finalPayLoad = frontOfPayLoad + backOfPayload;

            setTimeout(() => {
                // console.log ( "currentPosition:" + currentLetterToShift);
                // console.log ("Sending: " + finalPayLoad);

                deliveryMessage.edit(applyFormatting(finalPayLoad, formatIndex));

                // console.log ("SHIFTING");
            }, textShiftTime * currentLetterToShift);


        currentLetterToShift += 1;
        if (shiftSpeed < 1000 && currentLetterToShift < textToDeliver.length) {
            currentLetterToShift += 1;
        }
        if (shiftSpeed < 500 && currentLetterToShift < textToDeliver.length) {
            currentLetterToShift += 1;
        }

    }
    },
);

};

function cypherText(length) {

    const hiddenCharacterReplacements = '▙🅵⢯╏═║╒╓ⅥⅦⅧⅨⅪ╡╢♜╤╥╦╧╨╩╪╫╬￢☹￣𝛱𝜫𝝥𝞟𝛗✜𝜑𝜙𝝋▚𝞿𝟇✞𝛷𝜱█𝞥ￚￜￌ|│┃┄┅┆┇┈┉┊┋';
    let codedText = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * hiddenCharacterReplacements.length);
        codedText += hiddenCharacterReplacements.charAt(randomIndex);
    }
    return codedText;

}

function applyFormatting(enterMessage, formatIndex) {

    let deliveryMessage = enterMessage;

    if (formatIndex === 1) {
        deliveryMessage = '*' + deliveryMessage + '*';
    }

    else if (formatIndex === 2) {
        deliveryMessage = '**' + deliveryMessage + '**';
    }

    else if (formatIndex === 3) {
        deliveryMessage = '# ' + deliveryMessage;
    }

    else if (formatIndex === 4) {
        deliveryMessage = '`' + deliveryMessage + '`';
    }

    else if (formatIndex === 5) {
        deliveryMessage = '> ' + deliveryMessage;
    }

    return deliveryMessage;
}