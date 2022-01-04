import request from 'supertest'
import app from './app'

describe('Testing main route', () => {
  it('should return a status code', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done)
  })
})
