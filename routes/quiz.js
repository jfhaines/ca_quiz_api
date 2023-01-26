import express from 'express'
import { FlashcardModel, QuizModel } from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
    //res.send(await QuizModel.findById("63d1de4bb612e7efe6b2ef2c").populate({path: 'question', select: "question"} ))
    res.send(await QuizModel.find().populate({path: 'question'} ))
})


router.get('/cards/add/all', async (req, res) => {
    const cards = await FlashcardModel.find()
    const cardIds = Array.from(cards,v=>String(v._id))
    console.log(cardIds)
    const q = await QuizModel.findById("63d1d71cbb04d26dc1590579")
    q.question = cardIds
    q.save()
    res.send(await QuizModel.find().populate({path: 'question'} ))

})

router.get('/:id', async (req, res) => {
    try {
        const entry = await QuizModel.findById(req.params.name).populate({ path: 'subject', select: 'name' })
        if (entry) {
            res.send(entry)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Update
router.put('/:id', async (req, res) => {
    const { subject, content } = req.body
    const newEntry = { subject, content }

    try {
        const entry = await QuizModel.findByIdAndUpdate(req.params.id, newEntry, { returnDocument: 'after' })
        if (entry) {
            res.send(entry)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
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

router.post('/', async (req, res) => {
    try {
        // 1. Create a new entry object with values passed in from the request
        const { subjects, content } = req.body
        const subjectObject = await QuizModel.findOne({ name: subjects })
        const newEntry = { name: subjectObject.name, content }
        // 2. Push the new entry to the entries array
        // entries.push(newEntry)
        const insertedEntry = await QuizModel.create(newEntry)
        // 3. Send the new entry with 201 status
        res.status(201).send(await insertedEntry.populate({ path: 'subject', select: 'name' }))
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router