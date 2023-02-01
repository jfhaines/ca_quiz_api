import { FlashcardModel, SubjectModel, QuizModel, UserModel, dbClose } from '../src/db.js'

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

await QuizModel.deleteMany()
console.log('Deleted all Quizes')

const users = [
    { username: "test", password: "test"}
]

const subjects = [
    {name: 'Live', userId: '63d21798e23e4990fd09255c'},
    { name: 'Laugh', userId: '63d21798e23e4990fd09255c'},
    { name: 'Love', userId: '63d21798e23e4990fd09255c'}
]

const flashcards = [
    {
        question: "Who am I",
        answerOptions: [
            { text: "Answer 1", isCorrectOption: Boolean(1)},
            { text: "Answer 2", isCorrectOption: Boolean(0) },
            { text: "Answer 3", isCorrectOption: Boolean(0) },
            { text: "Answer 4", isCorrectOption: Boolean(0) }
        ]
    },
    {
        question: "What's My Name",
        answerOptions: [
            { text: "Answer 1", isCorrectOption: Boolean(1)},
            { text: "Answer 2", isCorrectOption: Boolean(0) },
            { text: "Answer 3", isCorrectOption: Boolean(0) },
            { text: "Answer 4", isCorrectOption: Boolean(0) }
        ]
    }
]

const quizes = [
    {
        name: "Very Nice Quiz",
        subjectID: '63d218149f6c29f31d5a50af',
        flashcards: flashcards
    }
]

// await FlashcardModel.insertMany(flashcards)
// console.log('Inserted Flashcards')
// await UserModel.insertMany(users)
// console.log('Inserted Users')
// await SubjectModel.insertMany(subjects)
// console.log('Inserted Subjects')
await QuizModel.insertMany(quizes)
console.log('Inserted Subjects')

dbClose()