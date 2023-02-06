import express, { request } from 'express'
import { SubjectModel, QuizModel } from '../db.js'
import mongoose from 'mongoose'

const router = express.Router()

// GET SUBJECTS
router.get('/', async (req, res) => {
    try {
        let subjects = await SubjectModel.find({ userId: req.userId }).populate('quizCount')
        res.status(200).send(subjects)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.get('/:subjectId', async (req, res) => {
    let subject = SubjectModel.findById(req.params.subjectId)
    let quizzes = QuizModel.aggregate([
        { $match: { subjectId: mongoose.Types.ObjectId(req.params.subjectId) } },
        { $project: { _id: 1, name: 1, flashcardCount: { $size: '$flashcards' } } }
    ])
    let data = await Promise.all([subject, quizzes])
    res.status(200).send({ subject: data[0], quizzes: data[1] })


    // let data = await Promise.all([ subject, quizzes ])
    // res.status(200).send({ subject: data[0], quizzes: data[1] })
})

// ADD NEW SUBJECT
router.post('/', async (req, res) => {
    try {
        // if no userId is entered this default one will be provided
        const { name } = req.body
        const newSubject = { userId: req.userId, name: name }

        const subject = await SubjectModel.create(newSubject)
        // 3. Send the new entry with 201 status
        res.status(201).send(subject)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// UPDATE SUBJECT
router.put('/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params
        const { name } = req.body
        const subject = { name: name }
        const result = await SubjectModel.findByIdAndUpdate(subjectId, subject, { returnDocument: 'after' })
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({ error: 'Subject not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Delete
router.delete('/:subjectId', async (req, res) => {
    try {
        let quizResult = await QuizModel.deleteMany({ subjectId: req.params.subjectId })
        let subjectResult = await SubjectModel.deleteOne({ _id: req.params.subjectId })
        console.log(subjectResult)
        if (subjectResult && subjectResult.deletedCount > 0) {
            res.sendStatus(204)
        } else {
            res.status(404).send({ error: 'Subject not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router