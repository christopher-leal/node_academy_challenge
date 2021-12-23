import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import logger from './utils/logger'
import routes from './routes'
import { connect } from './db/postgres'

dotenv.config()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(helmet())

app.use(routes)

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server online'
  })
})

connect()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server listening port ${PORT}`)
})
