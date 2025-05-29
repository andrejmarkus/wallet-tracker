import request from 'supertest'
import app from '../app'
import prisma from '../database/prisma'
import { userSchema } from '../schemas'

const testUser = {
  username: 'johndoe2',
  password: 'password1234',
  email: 'johndoe2@gmail.com'
}

describe('Auth API', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email
      }
    })
  })

  it('should register user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...testUser
      })

    expect(response.body).toHaveProperty('data.user')
    const result = userSchema.safeParse(response.body.data.user)
    expect(response.status).toBe(201)
    expect(result.success).toBe(true)

    const user = await prisma.user.findUnique({
      where: { email: testUser.email }
    })
    expect(user).toBeDefined()
  })

  it('should login user', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      username: testUser.username,
      password: testUser.password
    })

    expect(response.body).toHaveProperty('data.user')
    const result = userSchema.safeParse(response.body.data.user)
    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
  })

  it('should return 401 for invalid login credentials', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      username: testUser.username,
      password: 'wrongpassword'
    })
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message', 'Invalid credentials')
  })

  it('should logout user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', ['refreshToken=valid_refrsh_token;token=valid_token']) // Simulate a valid cookie
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'User signed out successfully'
    )
  })

  it("shouldn't logout user without valid cookie", async () => {
    const response = await request(app).post('/api/v1/auth/logout')
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty(
      'message',
      'User is not logged in'
    )
  })

  it('should return 400 for invalid registration data', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      username: '',
      password: 'password1234',
      email: ''
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'Invalid request data')
  })
})
