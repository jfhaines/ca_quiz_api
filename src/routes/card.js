import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose'
import {QuizModel, FlashcardModel} from '../db.js';
import {validateAllCards} from '../validation.js';

const router = express.Router()


async function selectCards(quizId, cardId){
    if (typeof cardId === 'string') {
        const a = await QuizModel.findById(quizId)
        const b = await a.flashcards.id(cardId)
        return b
    } else {
        return await QuizModel.findById(quizId).select({_id: 0, flashcards: 1})
    }
}

async function updateAnswer(quizId, cardId, answerId, update){
    const a = await QuizModel.findById(quizId)
    const b = a.flashcards.id(cardId)
    const c = b.answerOptions.id(answerId)

    _.assign(c, update)
    a.save()

    return c
}


async function deleteCard(quizId, cardId){
    const a = await QuizModel.findById(quizId)
    const b = a.flashcards.id(cardId)
    b.remove()
    a.save()

    return a
}


async function deleteAnswer(quizId, cardId, answerId){
    const a = await QuizModel.findById(quizId)
    const b = a.flashcards.id(cardId)
    const c = b.answerOptions.id(answerId)

    c.remove()
    a.save()

    return a
}

// If only a quizId is provided, all cards will be returned
// if a flashcardId is provided in the body it will return only that card
router.get('/:id', async (req, res) => {
    const quizId = await req.params.id
    const { cardId = false } = await req.body
    res.send(await selectCards(quizId, cardId))
})


router.put('/update', async (req, res) => {
    const { quizId, cardId, answerId, update } = await req.body
    console.log(update)
    res.send(await updateAnswer(quizId, cardId, answerId, update))
})


router.delete('/', async (req, res) => {
    const { quizId, cardId } = await req.body
    res.send(await deleteCard(quizId, cardId))
})


router.delete('/answer', async (req, res) => {
    const { quizId, cardId, answerId } = await req.body
    res.send(await deleteAnswer(quizId, cardId, answerId))
})

export default router