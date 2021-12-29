import dotenv from 'dotenv'
import logger from './utils/logger'
import './db/postgres'
import './models'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server listening port ${PORT}`)
})
