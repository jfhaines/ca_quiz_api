import express from 'express'
import quizRoutes from './src/routes/quiz.js'
import subjectRoutes from './src/routes/subject.js'
import cardRoutes from './src/routes/card.js'

import cors from 'cors'

const api_server = express()

api_server.use(cors())

api_server.use(express.json())

api_server.get('/', (request, response) => response.send({ info: 'CA QUIZ' }))

api_server.use('/quiz', quizRoutes)

api_server.use('/subject', subjectRoutes)

api_server.use('/card', cardRoutes)

const port = process.env.PORT || 4001

api_server.listen(port, () => console.log(`App running at http://localhost:${port}/`))

export default api_server