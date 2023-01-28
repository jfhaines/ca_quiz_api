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


// U S E R
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true}
})


// F L A S H C A R D
const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answerOptions: [{
        text: { type: String, required: true },
        isCorrectOption: { type: Boolean, required: true}
    }]
})

// Q U I Z
const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjectID: { type: mongoose.ObjectId, ref: 'Subject'},
    flashcards: [ flashcardSchema ]
})

// S U B J E C T
const subjectSchema = new mongoose.Schema({
    userId: { type: mongoose.ObjectId, ref: 'User' },
    name: { type: String, required: true },
})

const QuizModel = mongoose.model('Quiz', quizSchema)
const SubjectModel = mongoose.model('Subject', subjectSchema)
const FlashcardModel = mongoose.model('Flashcard', flashcardSchema)
const UserModel = mongoose.model('User', userSchema)

export { QuizModel, FlashcardModel, SubjectModel, UserModel, dbClose }