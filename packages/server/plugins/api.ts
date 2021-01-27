import type { FastifyPluginCallback as Plugin } from 'fastify';
import { v4 as uuid } from 'uuid';
import jwt from 'jwt-simple';
import ms from 'ms';

import type { Session, TokenPayload } from '~/types';
import sessions from '~/routes/api/sessions';
import decks from '~/routes/api/decks';
import users from '~/routes/api/users';

declare module 'fastify' {
  interface FastifyInstance {
    generateSession: (userId: string) => Promise<Session>;
  }
}

const apiPlugin: Plugin = async (app, opts, done) => {
  app
    .addSchema({
      $id: 'credentialsSchema',
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    })
    .addSchema({
      $id: 'sessionSchema',
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        sessionId: { type: 'string' },
        expiresIn: { type: 'number' },
      },
    });

  app.decorate('generateSession', async function (userId: string) {
    const currentTime = Date.now();
    const { sessionId } = await app.prisma.session.upsert({
      where: { userId },
      update: {
        sessionId: uuid(),
        sessionExpiration: new Date(currentTime + ms('1 day')),
      },
      create: {
        user: { connect: { userId } },
        sessionId: uuid(),
        sessionExpiration: new Date(currentTime + ms('1 day')),
      },
    });

    const expiresIn = ms('5 minutes');
    const payload: TokenPayload = {
      sub: userId,
      iat: currentTime,
      exp: expiresIn + currentTime,
    };

    return {
      accessToken: jwt.encode(payload, process.env.SECRET as string),
      sessionId,
      expiresIn,
    };
  });

  app
    .register(sessions, { prefix: 'sessions' })
    .register(decks, { prefix: 'decks' })
    .register(users, { prefix: 'users' });

  done();
};

export default apiPlugin;

export const autoPrefix = '/api';
