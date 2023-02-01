import express from 'express';
import _ from 'lodash';
import {QuizModel} from '../db.js';
import {validateAllCards} from '../validation.js';

const router = express.Router()


function selectAll(){
    return QuizModel.find().select({_id: 1, name: 1})
}


function selectOneQuiz(quizId) {
    return QuizModel.findById(quizId);
}

// validates card input before performing any CRUD operations
// TODO: validate other input
async function quizCRUD( { subjectId, quizId, quizName, flashcards } ) {
    const validateCards = await validateAllCards(flashcards)

    if (_.isString(validateCards)) {
        // Valid entry returns Bool true, returned string is error message
        return { code: 500, body: { error: validateCards } }
    }

    if (validateCards) {
        return { subjectId, quizId, quizName, flashcards }
    } else {
        return  { subjectId, quizId, quizName, flashcards: [] }
    }
}


// List the available quizzes, name used for display, _id used for selection
router.get('/', async (req, res) => {
    res.send(await selectAll())
})

// Select card by _id to return flashcards
router.get('/:id', async (req, res) => {
    const quizId = await req.params.id
    res.send(await selectOneQuiz(quizId))
})


// Create quiz
/*
summary: "Create a new quiz",
description: "",
requestSchema:
    params:
        subjectId:
            description: "Subject ID",
            required: true
        quizName:
            description: "New name for the quiz",
            required: true
        flashcards:
            description: "Object containing flashcard values",
            required: false
 */
router.post('/new', async (req, res) => {
//    const response = await quizCRUD(req.body, newQuiz)
//    res.status(response.code).send(response.body)
    quizCRUD(req.body).then(({ subjectId, quizName, flashcards, code, body}) => {
        if (code === 500) {
            res.status(500).send(body)
        } else {
            const entryData = { subjectID: subjectId, name: quizName, flashcards }
            QuizModel.create(
               entryData
            ).then(v => {
                res.send(v)
            }).catch((error) => {
                console.warn(error)
                res.status(500).send({error: 'Server Error: Failed to update entry'})
            })

        }}).catch((error) => {
        console.warn(error)
        res.status(500).send({error: 'Server Error: Failed to update entry'})
    })
})


// Update quiz with new card/s
/*
summary: "Update a quiz",
description: "Updates quiz with one or many flashcards, quiz name can also be changed",
requestSchema:
    params:
        subjectId:
            description: "Subject ID",
            required: true
        quizName:
            description: "New name for the quiz",
            required: true
        flashcard:
            description: "Object containing flashcard values", required: false,
            innerSchema:
                params:
                    question: String, required: true,
                    answerOptions: [{}], required: true
                        innerSchema:
                            text: String, required: true,
                            isCorrectOption: Boolean, required: true
 */
router.put('/update', async (req, res) => {
    quizCRUD(req.body).then(({quizId, quizName, flashcards, code, body}) => {
        if (code === 500) {
            res.status(500).send(body)
        } else {
            QuizModel.updateOne(
                {_id: quizId},
                {name: quizName, $push: {flashcards: flashcards}}).then(v => {
                if (v.acknowledged) {
                    selectOneQuiz(quizId).then(updatedQuiz => res.send(updatedQuiz))
                } else {
                    res.status(500).send({error: 'Server Error: Failed to update entry'})
                }
            }).catch((error) => {
                console.warn(error)
                res.status(500).send({error: 'Server Error: Failed to update entry'})
            })

        }}).catch((error) => {
            console.warn(error)
            res.status(500).send({error: 'Server Error: Failed to update entry'})
        })
})


// Delete
router.delete('/', async (req, res) => {
    try {
        const entry = await QuizModel.findByIdAndDelete(req.body.quizId)
        if (entry) {
            res.sendStatus(204)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router