import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import logger from './utils/logger'

dotenv.config()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(helmet())

const port = process.env.PORT || 3000

app.listen(port, () => {
  logger.info(`Server listening port ${port}`)
})
