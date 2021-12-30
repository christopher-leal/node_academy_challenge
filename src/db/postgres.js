import { Sequelize } from 'sequelize'
import logger from './../utils/logger'
import config from 'config'

const baseUrl = config.get('postgres.URL')
const url = baseUrl
  .replace('{user}', process.env.DB_USER)
  .replace('{pass}', process.env.DB_PASSWORD)
  .replace('{host}', process.env.DB_HOST)
  .replace('{port}', process.env.DB_PORT)
  .replace('{db}', process.env.DB_DATABASE)

const sequelize = new Sequelize(url, {
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
