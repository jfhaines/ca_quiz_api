import { FlashcardModel, SubjectModel, QuizModel, dbClose } from './db.js'

await FlashcardModel.deleteMany()
console.log('Deleted all Flashcards')
await SubjectModel.deleteMany()
console.log('Deleted all Subjects')

await QuizModel.deleteMany()
console.log('Deleted all Quizes')

const subjects = [
    { name: 'Live' },
    { name: 'Laugh' },
    { name: 'Love' }
]

const flashcards = [
    { question: "Who am I", correctAnswer: "a", answers: {a: "alec", b: "not alec", c: "unsure", d: "me"} },
    { question: "Who am I", correctAnswer: "b", answers: {a: "alec", b: "not alec", c: "unsure", d: "me"} },
    { question: "Who am I", correctAnswer: "c", answers: {a: "alec", b: "not alec", c: "unsure", d: "me"} }
]

const quizes = [
    { name: "Very Nice Quiz"},
    { name: "That's a no from me dawg"}
]

await FlashcardModel.insertMany(flashcards)
console.log('Inserted Flashcards')
await SubjectModel.insertMany(subjects)
console.log('Inserted Subjects')
await QuizModel.insertMany(quizes)
console.log('Inserted Subjects')

dbClose()