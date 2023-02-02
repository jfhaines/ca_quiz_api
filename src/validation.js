import _ from 'lodash';

function validateString(value) {
    return _.isString(value) && value.length > 0 && !_.startsWith(value, ' ');
}

/*
summary: "Validates question and answerOptions for type and content",
description: "Receives a single card as it's input, multiple cards require outside loop",
requestSchema:
    params:
        flashcard :: Object,
            internalParams:
                question :: String,
                answerOptions  :: Array,
                    internalParams:
                        text :: String,
                        isCorrectOption :: Boolean
 */
function validateCard( { question, answerOptions } ) {
    if ( validateString(question) &&  _.isArray(answerOptions) ) {
        return answerOptions.every( v => {
            return validateString(v.text) && _.isBoolean(v.isCorrectOption)
        })
    }

    return false
}

// Validates array of cards
// Distinguishes between an array of valid cards, an empty array, or an array that contains an invalid card
// returns Bool for valid or empty, and string for invalid
function validateAllCards(flashcards) {
    if ( _.isArray(flashcards) && flashcards.length > 0 ) {
        const validated = flashcards.every( card => { return validateCard(card) })
        if (validated) {
            return true
        } else {
            return "Invalid card provided"
        }
    }

    return false
}

export { validateString, validateCard, validateAllCards };