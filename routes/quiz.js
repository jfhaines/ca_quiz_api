import express from 'express'
import {FlashcardModel, QuizModel, SubjectModel} from '../db.js'

const router = express.Router()

// checks card values match type and are not empty
// need to test if it works, if returns undefined need to make it a Promise
function parseCards({answerOptions, question}) {
    if (typeof question === "string" &&  answerOptions.constructor === Array) {
        return answerOptions.every(({isCorrectOption, text}) => {
            return typeof text === "string" && text.length > 0 && typeof isCorrectOption === "boolean";
        })
    }
}
// List the available quizzes, name used for display, _id used for selection
router.get('/', async (req, res) => {
    res.send(await QuizModel.find().select({_id: 1, name: 1}))
})

// Select card by _id to return flashcards
router.get('/cards', async (req, res) => {
    const id = await req.query.id
    const cardData = await QuizModel.findById(id)
    res.send(cardData)
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
        flashcard:
            description: "Object containing flashcard values",
            required: false
 */
router.post('/new', async (req, res) => {
    const { subjectId, quizName, flashcard } = req.body
    const newQuiz = { name: quizName, subjectID: subjectId, flashcards: flashcard }
    const insertQuiz = await QuizModel.create(newQuiz)
    res.status(201).send(await insertQuiz)
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
    const { subjectId, quizId, quizName, flashcard } = req.body


    QuizModel.findById( quizId, quiz => {
        quiz.flashcards.push(flashcard)
        quiz.save()
    })
    const update = await SubjectModel.findByIdAndUpdate(quizId,
        {
            name: quizName,
            subjectID: subjectId,
            flashcards: flashcards
        },
        { returnDocument: 'after' }
    )

    if (update) {
        res.send(update)
    } else {
        res.status(404).send({ error: 'Entry not found' })
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const entry = await QuizModel.findByIdAndDelete(req.params.name)
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