import express from 'express';
import _ from 'lodash';
import {QuizModel} from '../db.js';


const router = express.Router()


async function selectCards(quizId, cardId){
    if (typeof cardId === 'string') { // v basic validation
        const a = await QuizModel.findById(quizId)
        return await a.flashcards.id(cardId)
    } else {
        return await QuizModel.findById(quizId).select({_id: 0, flashcards: 1})
    }
}

// Updates an individual answer
/*
Four-step process:
1. Select the quiz by its ID
2. Select flashcard by its ID
3. Select the answer by its ID
4. Update the answer values
 */
async function updateAnswer(quizId, cardId, answerId, update){
    const a = await QuizModel.findById(quizId)
    const b = a.flashcards.id(cardId)
    const c = b.answerOptions.id(answerId)

    _.assign(c, update) // uses lodash method to assign value TODO: implement validation
    a.save() // save can't be called on subdocuments, hence calling it on the QuizModel

    return c
}



// If only a quizId is provided, all cards will be returned
// If a flashcardId is provided in the body it will return only that card
router.get('/:quizId/flashcard/:flashcardId', async (req, res) => {
    const quizId = await req.params.id
    const { cardId = false } = await req.body
    res.send(await selectCards(quizId, cardId))
})


router.put('/:quizId/flashcard/:flashcardId', async (req, res) => {
    try {
        const { quizId, flashcardId } = req.params
        const { question, answerOptions, takesTextInput } = req.body
        
        let result = await QuizModel.findOneAndUpdate(
            { "_id": quizId, "flashcards._id": flashcardId },
            { "$set": {
                "flashcards.$": { question, answerOptions, takesTextInput }
            }},
            { returnDocument: 'after' } 
        )
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({ error: 'Quiz or flashcard not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Delete whole card
router.delete('/:quizId/flashcard/:flashcardId', async (req, res) => {
    try {
        const { quizId, flashcardId } = req.params
        let result = await QuizModel.updateOne(
            { _id: quizId },
            { $pull: { flashcards: { _id: flashcardId } } }
        )

        if (result.modifiedCount > 0) {
            res.status(200).send()
        } else {
            res.status(404).send({ error: 'Quiz or flashcard not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


export default router