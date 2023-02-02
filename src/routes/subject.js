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
        // if no userId is entered this default one will be provided
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
        const { userId = '63d21798e23e4990fd09255c', subjectId, subjectName } = req.body

        const updateSubject = { userId: userId, name: subjectName }

        const update = await SubjectModel.findByIdAndUpdate(subjectId, updateSubject, { returnDocument: 'after' })

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
        const entry = await QuizModel.findByIdAndDelete(req.body.subjectId)
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