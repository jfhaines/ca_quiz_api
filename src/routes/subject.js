import express from 'express'
import { SubjectModel, QuizModel } from '../db.js'

const router = express.Router()

// GET SUBJECTS
router.get('/', async (req, res) => {
    res.send(await SubjectModel.find().select({name: 1, _id: 1}))
})

// ADD NEW SUBJECT
router.post('/new', async (req, res) => {
    try {
        // 1. Create a new entry object with values passed in from the request
        const { userId = '63d21798e23e4990fd09255c', name, quiz = [] } = req.body
        const newSubject = { userId: userId, name: name, quiz: quiz }

        const insertSubject = await SubjectModel.create(newSubject)
        // 3. Send the new entry with 201 status
        res.status(201).send(await insertSubject)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// UPDATE SUBJECT
router.put('/update', async (req, res) => {
    try {
        const { id, name } = req.body

        const { userId } = await SubjectModel.findById(id).select({userId: 1, _id: 0})

        const updateSubject = { userId: userId, name: name }

        const update = await SubjectModel.findByIdAndUpdate(id, updateSubject, { returnDocument: 'after' })

        if (update) {
            res.send(update)
        } else {
            res.status(404).send({ error: 'Entry not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Delete
router.delete('/delete', async (req, res) => {
    try {
        const entry = await QuizModel.findByIdAndDelete(req.body.id)
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