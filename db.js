import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', true)

async function dbClose() {
    await mongoose.connection.close()
    console.log("Database disconnected!")
}

// Connect to a MongoDB via Mongoose
try {
    const m = await mongoose.connect(process.env.ATLAS_DB_URL)
    console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect')
}
catch (err) {
    console.log(err)
}

// Q U I Z
const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    question: [{ type: mongoose.ObjectId, ref: "Flashcard" }]
})

const QuizModel = mongoose.model('Quiz', quizSchema)

// S U B J E C T
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quizIds: { type: Array, required: false }
})
const SubjectModel = mongoose.model('Subject', subjectSchema)

// F L A S H C A R D
const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    answers: {
        a: {type: String, required: true},
        b: {type: String, required: true},
        c: {type: String, required: true},
        d: {type: String, required: true}
    }
})
const FlashcardModel = mongoose.model('Flashcard', flashcardSchema)


export { QuizModel, FlashcardModel, SubjectModel, dbClose }