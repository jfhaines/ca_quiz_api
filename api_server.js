import express from 'express'
import { FlashcardModel, SubjectModel, QuizModel} from './db.js'
import quizRoutes from './routes/quiz.js'
import cors from 'cors'

const api_server = express()

api_server.use(cors())

api_server.use(express.json())

api_server.get('/', (request, response) => response.send({ info: 'CA QUIZ' }))

api_server.use('/quiz', quizRoutes)

const port = process.env.PORT || 4001

api_server.listen(port, () => console.log(`App running at http://localhost:${port}/`))

export default api_server