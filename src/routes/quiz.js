import express from 'express';
import _ from 'lodash';
import {QuizModel} from '../db.js';
import {validateAllCards} from '../validation.js';

const router = express.Router()

// Returns all the Quizzes, but just their names and id numbers
function selectAll(){
    return QuizModel.find().select({_id: 1, name: 1})
}

// Returns full detail about one quiz
function selectOneQuiz(quizId) {
    return QuizModel.findById(quizId);
}

/*
- Validates card input before performing any CRUD operations
- Majority of functionality comes from validation.js, quizCRUD is just the final stage that validation.js couldn't handle
- TODO: validate other input
 */
async function quizCRUD( { subjectId, quizId, quizName, flashcards } ) {
    // Checks the flashcards array for validity
    // returns true for valid, false for empty, and string error message for invalid data
    const validateCards = await validateAllCards(flashcards)

    if (_.isString(validateCards)) {
        return { code: 500, body: { error: validateCards } }
    }

    if (validateCards) {
        return { subjectId, quizId, quizName, flashcards }
    } else { // if validateCards is false the flashcards array must be empty
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
    // uses chain of .then() to execute asynchronously
    quizCRUD(req.body).then(({ subjectId, quizName, flashcards, code, body}) => { // validates input supplied by request body
        // code and body will only exist in this stage if invalid data has been supplied
        if (code === 500) { // for valid data 'code' would === undefined
            res.status(500).send(body)
        } else {
            const entryData = { subjectID: subjectId, name: quizName, flashcards }
            QuizModel.create( entryData )
                .then(v => { // v is the returned data from running QuizModel.create()
                    res.send(v)
                }).catch((error) => {
                    console.warn(error)
                    res.status(500).send({error: 'Server Error: Failed to update entry'}) // error at this stage would likely be an invalid subjectID TODO: check this theory
                })

            }
    }).catch((error) => {
            console.warn(error)
            res.status(500).send({error: 'Server Error: Failed to update entry'}) // error here should be server fault TODO: test this theory
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
/*
NOTES:
Functionality is similar to /new, however updateOne doesn't return the update entry,
on successful completion it returns an object containing 'acknowledged', which is a Bool and is true when successful.
Another call is then made to the DB for the updated Quiz.
The method used in card.js updateAnswer() could probably be used to update the quiz in a simpler way
TODO: simplify this methods operation
 */
router.put('/update', async (req, res) => {
    quizCRUD(req.body).then(({quizId, quizName, flashcards, code, body}) => {
        if (code === 500) {
            res.status(500).send(body)
        } else {
            QuizModel.updateOne(
                {_id: quizId},
                {name: quizName, $push: {flashcards: flashcards}}).then(v => { // quizName is written every time, so it needs to be entered even if it isn't changed
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