import { createClient } from 'redis'
import config from 'config'
import logger from './../utils/logger'

const baseUrl = config.get('redis.URL')
const url = baseUrl
  .replace('{user}', process.env.REDIS_USER)
  .replace('{pass}', process.env.REDIS_PASSWORD)
  .replace('{host}', process.env.REDIS_HOST)
  .replace('{port}', process.env.REDIS_PORT)

const client = createClient('redis://redistogo:4464c8ac46bbea1d13ec92763ea6c116@hammerjaw.redistogo.com:10124/')
console.log(url);
(async () => {
  client.on('error', (err) => logger.error('Redis Client Error', err))
  await client.connect()
  logger.info('Redis connection has been established successfully.')
})()

export default client
