import { Sequelize } from 'sequelize'
import logger from './../utils/logger'
import config from 'config'

const sequelize = new Sequelize(config.get('postgres.DB_DATABASE'), config.get('postgres.DB_USER'), config.get('postgres.DB_PASSWORD'), {
  host: config.get('postgres.DB_HOST'),
  port: config.get('postgres.DB_PORT'),
  dialect: 'postgres',
  logging: false
})

export const connect = async () => {
  try {
    await sequelize.sync({ force: true })
    logger.info('Connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
}

export default sequelize
