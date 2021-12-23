import { Sequelize } from 'sequelize'
import logger from './../utils/logger'
import config from 'config'

const sequelize = new Sequelize(`postgres://${config.get('postgres.DB_USER')}:${config.get('postgres.DB_PASSWORD')}@${config.get('postgres.DB_HOST')}:${config.get('postgres.DB_PORT')}/${config.get('postgres.DB_DATABASE')}`)

export const connect = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
}

export default sequelize
