import { createClient } from 'redis'
import config from 'config'
import logger from './../utils/logger'

const redisUrl = config.get('redis.url')

const client = createClient({
  url: redisUrl
});

(async () => {
  client.on('error', (err) => logger.error('Redis Client Error', err))

  await client.connect()
})()

export default client
