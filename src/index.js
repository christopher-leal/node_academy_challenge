import logger from './utils/logger'
import { connect } from './db/postgres'
import './models'
import app from './app'

connect()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server listening port ${PORT}`)
})
