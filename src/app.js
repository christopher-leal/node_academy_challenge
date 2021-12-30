import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import logger from './utils/logger'
import routes from './routes'
dotenv.config()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(helmet())

app.use('/api', routes)

app.get('/', (req, res) => {
  logger.info('Server is online')
  return res.json({
    success: true,
    message: 'Server online'
  })
})

export default app
