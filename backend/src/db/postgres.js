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
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

export const connect = async () => {
  try {
    await sequelize.authenticate()
    logger.info('DB connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
}

export default sequelize
