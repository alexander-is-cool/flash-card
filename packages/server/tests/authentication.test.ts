import type { FastifyInstance } from 'fastify';
import * as uuid from 'uuid';
import ms from 'ms';

import type { Session, Error } from '~/types';
import createApp from '~/app';

let server: FastifyInstance;

beforeAll(async () => {
  server = createApp({ logger: false });

  await server.ready();
});

beforeEach(async () => {
  await server.prisma.$queryRaw('DELETE FROM users;');
});

describe('creating a user', () => {
  test('with no credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Bad Request');
    expect(payload.message).toBeTruthy();
  });

  test('with a username that is not taken', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Session = JSON.parse(response.body);

    expect(uuid.validate(payload.sessionId)).toBe(true);
    expect(payload.accessToken.split('.')).toHaveLength(3);
    expect(payload.expiresIn).toBe(ms('5 mins'));
  });

  test('with a username that is taken', async () => {
    const request: any = {
      method: 'POST',
      url: '/api/users',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    };

    await server.inject(request);
    const response = await server.inject(request);

    expect(response.statusCode).toBe(409);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Conflict');
    expect(payload.message).toBeTruthy();
  });
});

describe('logging in', () => {
  beforeEach(async () => {
    await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    });
  });

  test('with no credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/sessions',
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Bad Request');
    expect(payload.message).toBeTruthy();
  });

  test('with the correct credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/sessions',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Session = JSON.parse(response.body);

    expect(uuid.validate(payload.sessionId)).toBe(true);
    expect(payload.accessToken.split('.')).toHaveLength(3);
    expect(payload.expiresIn).toBe(ms('5 mins'));
  });

  test('with the wrong credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/sessions',
      payload: {
        username: 'alexander',
        password: 'wrong-password',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Unauthorized');
    expect(payload.message).toBeTruthy();
  });
});

describe('refreshing session', () => {
  let sessionId: string;

  beforeEach(async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    });

    sessionId = (JSON.parse(response.body) as Session).sessionId;
  });

  test('with valid refresh token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/api/sessions/${sessionId}/refresh`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Session = JSON.parse(response.body);

    expect(uuid.validate(payload.sessionId)).toBe(true);
    expect(payload.sessionId).not.toBe(sessionId);
    expect(payload.accessToken.split('.')).toHaveLength(3);
    expect(payload.expiresIn).toBe(ms('5 mins'));
  });

  test('with random refresh token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/api/sessions/${uuid.v4()}/refresh`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Unauthorized');
    expect(payload.message).toBeTruthy();
  });

  test('with invalid refresh token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/sessions/invalid-refresh-token/refresh',
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Bad Request');
    expect(payload.message).toBeTruthy();
  });
});

describe('logging out', () => {
  let sessionId: string;

  beforeEach(async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        username: 'alexander',
        password: 'password123',
      },
    });

    sessionId = (JSON.parse(response.body) as Session).sessionId;
  });

  test('with valid refresh token', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/sessions/${sessionId}`,
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBeFalsy();
  });

  test('with random refresh token', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/sessions/${uuid.v4()}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Not Found');
    expect(payload.message).toBeTruthy();
  });

  test('with invalid refresh token', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/sessions/invalid-refresh-token',
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers['content-type']).toMatch('application/json');

    const payload: Error = JSON.parse(response.body);

    expect(payload.error).toBe('Bad Request');
    expect(payload.message).toBeTruthy();
  });
});

afterAll(() => {
  server.close();
});
