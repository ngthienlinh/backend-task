const supertest = require('supertest')
const app = require('../../index')

describe('Auth Endpoints', () => {
  let request = null
  let server = null

  beforeAll(() => {
    server = app.listen()
    request = supertest.agent(server)
  })

  afterAll(() => server.close())

  it('Should redirect after login', async () => {
    const res = await request.post('/auth/signin')
      .send({
        username: 'studenta@mail.com',
        password: 'abc12345',
      })
    expect(res.statusCode).toEqual(302)
  })

  it('Should return 404 error', async () => {
    const res = await request.post('/auth/signin')
      .send({
        username: 'studenta@mail.com',
        password: 'abc12346',
      })
    expect(res.statusCode).toEqual(404)
  })

  it('Should return 400 error with msg email already in used', async () => {
    const res = await request.post('/auth/signup').send({ name: 'test', userId: 'studenta@mail.com', password: 'aaaaadddd2' })
    expect(res.statusCode).toEqual(400)
    expect(res.error).toHaveProperty('text')
    expect(res.error.text).toEqual('{"msg":"This email is already in used."}')
  })

  it('Should return new userId', async () => {
    const res = await request.post('/auth/signup').send({ name: 'test', userId: 'studentb@mail.com', password: 'aaaaadddd2' })
    expect(res.statusCode).toEqual(200)
    expect(JSON.parse(res.text)).toHaveProperty('userId', 'studentb@mail.com')
  })
})