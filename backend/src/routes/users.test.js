import request from 'supertest'
import User from '../models/user'
import app from './../app'

jest.mock('../models/user')

describe('Testing user routes', () => {
  it('POST /api/users should register an user', (done) => {
    User.create.mockReturnValue({ email: 'chris@chris.com', password: 'password', username: 'chris' })
    request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ user: { email: 'chris@chris.com', password: 'password', username: 'chris' } })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        return done()
      })
  })

  it('POST /api/users/login should not be authorized user', (done) => {
    request(app)
      .post('/api/users/login')
      .send({ user: { email: 'chris@chris.com', password: 'bad-password' } })
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.errors.body[0]).toBe('email or password doesn\'t match')
        return done()
      })
  })
})
