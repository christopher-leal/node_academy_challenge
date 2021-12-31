import { createClient } from 'redis'
import config from 'config'
import logger from './../utils/logger'
const baseUrl = config.get('redis.URL')
const { promisify } = require('util')

const url = baseUrl
  .replace('{user}', process.env.REDIS_USER)
  .replace('{pass}', process.env.REDIS_PASSWORD)
  .replace('{host}', process.env.REDIS_HOST)
  .replace('{port}', process.env.REDIS_PORT)

const client = createClient('redis://default:aiCyNqJFz3aCEExVOeg9d4m8XwlmAK6c@redis-12086.c10.us-east-1-2.ec2.cloud.redislabs.com:12086')
client.hGet = promisify(client.hget)
client.hSet = client.hset
client.hDel = client.hdel;

(() => {
  client.on('error', (err) => logger.error('Redis Client Error', err))
  logger.info('Redis connection has been established successfully.')
})()

export default client
