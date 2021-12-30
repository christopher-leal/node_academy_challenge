import { createClient } from 'redis'
import config from 'config'
import logger from './../utils/logger'

const baseUrl = config.get('redis.URL')
const url = baseUrl
  .replace('{user}', process.env.REDIS_USER)
  .replace('{pass}', process.env.REDIS_PASSWORD)
  .replace('{host}', process.env.REDIS_HOST)
  .replace('{port}', process.env.REDIS_PORT)
// // const url = 'rediss://:p4315cea4aff8616d9105c1646a8b245414750a4f68eca716ae8bcc6c01a96850@ec2-52-206-137-51.compute-1.amazonaws.com:28869'
const client = createClient('redis://default:password@localhost:6379', { no_ready_check: true });

// const client = createClient('redis://:p4315cea4aff8616d9105c1646a8b245414750a4f68eca716ae8bcc6c01a96850@ec2-52-206-137-51.compute-1.amazonaws.com:28869')
// console.log(url);
// client.auth(process.env.REDIS_PASSWORD);
(async () => {
  client.on('error', (err) => logger.error('Redis Client Error', err))
  await client.connect()
  logger.info('Redis connection has been established successfully.')
})()

export default client
