import request from 'supertest';
import app from '../app';
import { deleteTestUser, registerTestUser } from '../utils/testUtils';
import { randomUUID } from 'crypto';
import { tokenDetailsSchema } from '../schemas';
import { User } from '../types';

const tokenRequest = {
  tokenAddress: '78fh1Fh8tEQUA1heazhJANhQ6QT1Ex3fw6WY7Hxupump',
  solanaAmount: 0.25,
  tokenMarketCapInSolana: 1,
  tokenAmount: 100,
  currencySymbol: 'USD',
}

const invalidTokenRequest = {
  tokenAddress: 'invalid_address',
  solanaAmount: -0.25, // Invalid amount
  tokenMarketCapInSolana: 1,
  tokenAmount: 100,
  currencySymbol: 'USD',
}

let uuid: string;
let userWithCookie: { user: User, authCookie: string };

beforeAll(async () => {
  uuid = randomUUID();
  userWithCookie = await registerTestUser(uuid);
});

afterAll(async () => {
  await deleteTestUser(userWithCookie.user);
});

describe('Token API', () => {
  it('should return token details', async () => {
    const response = await request(app)
      .post('/api/v1/tokens')
      .send(tokenRequest)
      .set('Cookie', userWithCookie.authCookie);

    const result = tokenDetailsSchema.safeParse(response.body.data);
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .post('/api/v1/tokens')
      .send(tokenRequest);
      
    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid token data', async () => {
    const response = await request(app)
      .post('/api/v1/tokens')
      .send(invalidTokenRequest)
      .set('Cookie', userWithCookie.authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid request data');
  });
});
