import { FastifyInstance } from 'fastify';
import createApp from '~/app';

let server: FastifyInstance;

beforeAll(async () => {
  server = createApp({ logger: false });

  await server.ready();
});

describe('Testing api', () => {
  test('decks endpoint works', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/decks',
    });

    expect(response.body).toBe('decks');
  });

  test('sessions endpoint works', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/sessions',
    });

    expect(response.body).toBe('sessions');
  });
});

afterAll(() => {
  server.close();
});
