import { SubjectModel, QuizModel, UserModel, dbClose } from '../src/db.js'
import bcrypt from 'bcrypt'

/*
            !!! READ ME !!
- users needs to be created first
- subjects need the user _id put in for it
- then use subject _id for quiz entry

Could automate it, but haven't
*/

// await FlashcardModel.deleteMany()
// console.log('Deleted all Flashcards')

// await UserModel.deleteMany()
// console.log('Deleted all Users')


// await SubjectModel.deleteMany()
// console.log('Deleted all Subjects')

await UserModel.deleteMany()
await SubjectModel.deleteMany()
await QuizModel.deleteMany()
console.log('Deleted all collections')

const user = await UserModel.create({ username: 'user', password: await bcrypt.hash('password', 10)})


const subjectList = [
    { name: 'German', userId: user._id },
    { name: 'French', userId: user._id },
    { name: 'Psychology', userId: user._id },
    { name: 'MATH4051', userId: user._id }
]

let subjects = await SubjectModel.insertMany(subjectList)
// console.log(subjects[0]._id)

const quizList = [
    {
        name: 'Quiz One',
        subjectId: subjects[0]._id,
        flashcards: [
            {
                question: "What does 'es tut mir leid' mean in German?",
                answerOptions: [
                    {
                        text: 'Excuse me',
                        isCorrectOption: false
                    },
                    {
                        text: "I'm sorry",
                        isCorrectOption: true
                    },
                    {
                        text: "Good morning",
                        isCorrectOption: false
                    },
                    {
                        text: "Goodbye",
                        isCorrectOption: false
                    }
                ],
                takesTextInput: false
            },
            {
                question: "How do you say good afternoon in German?",
                answerOptions: [
                    {
                        text: 'Guten Morgen',
                        isCorrectOption: false
                    },
                    {
                        text: "Guten Abend",
                        isCorrectOption: false
                    },
                    {
                        text: "Guten Tag",
                        isCorrectOption: true
                    }
                ],
                takesTextInput: false
            },
            {
                question: "How do you say hello in German?",
                answerOptions: [
                    {
                        text: 'Hallo',
                        isCorrectOption: true
                    }
                ],
                takesTextInput: true
            },
            {
                question: "How do you say Mother in German?",
                answerOptions: [
                    {
                        text: 'Mutter',
                        isCorrectOption: true
                    }
                ],
                takesTextInput: false
            },
        ]
    }
]

let quizzes = await QuizModel.insertMany(quizList)


// await FlashcardModel.insertMany(flashcards)
// console.log('Inserted Flashcards')
// await UserModel.insertMany(users)
// console.log('Inserted Users')
// await SubjectModel.insertMany(subjects)
// console.log('Inserted Subjects')

console.log('Inserted Subjects')

dbClose()