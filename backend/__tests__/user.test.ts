import request from 'supertest';
import app from '../app';
import { deleteTestUser, registerTestUser } from '../utils/testUtils';
import { randomUUID } from 'crypto';
import { User } from '../types';
import { userSchema } from '../schemas';

let uuid: string;
let userWithCookie: { user: User; authCookie: string };

beforeAll(async () => {
  uuid = randomUUID();
  userWithCookie = await registerTestUser(uuid);
});

afterAll(async () => {
  await deleteTestUser(userWithCookie.user);
});

describe('User API', () => {
  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Cookie', userWithCookie.authCookie);

    const users = response.body.data.users as User[];
    const result = users.every((user: User) =>
      userSchema.safeParse(user).success
    );
    expect(response.status).toBe(200);
    expect(result).toBe(true);
  });

  it('should get user by ID', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${userWithCookie.user.id}`)
      .set('Cookie', userWithCookie.authCookie);

    const result = userSchema.safeParse(response.body.data.user);
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should get authorized user', async () => {
    const response = await request(app)
      .get('/api/v1/users/authorized')
      .set('Cookie', userWithCookie.authCookie);

    const result = userSchema.safeParse(response.body.data.user);
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/v1/users/9999')
      .set('Cookie', userWithCookie.authCookie);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(401);
  });

  it('should return 401 for unauthorized user by ID', async () => {
    const response = await request(app).get(`/api/v1/users/${userWithCookie.user.id}`);
    expect(response.status).toBe(401);
  });
});
