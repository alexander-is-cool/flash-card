import type { FastifyPluginCallback as Plugin } from 'fastify';
import bcrypt from 'bcrypt';

import type { Credentials, SessionId } from '~/types';
import { validateParamIds } from '~/utils/middleware';
import { AuthenticationError, NotFoundError } from '~/utils/errors';

const sessionRouter: Plugin = (app, opts, done) => {
  app.post('/', {
    async handler(request, reply) {
      const { username, password } = request.body as Credentials;

      const user = await app.prisma.user.findUnique({
        where: { username },
      });

      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const session = await app.generateSession(user.userId);

        reply.code(201).send(session);
      } else {
        reply.send(
          new AuthenticationError('the username and password do not match'),
        );
      }
    },

    schema: {
      body: {
        $ref: 'credentialsSchema',
      },
      response: {
        201: { $ref: 'sessionSchema' },
      },
    },
  });

  app.post('/:sessionId/refresh', {
    preHandler: [validateParamIds],

    async handler(request, reply) {
      const { sessionId } = request.params as SessionId;

      const session = await app.prisma.session.findUnique({
        where: { sessionId },
      });

      if (session && (session.sessionExpiration as Date) > new Date()) {
        const newSession = await app.generateSession(session.userId);

        reply.send(newSession);
      } else {
        reply.send(new NotFoundError('session does not exist'));
      }
    },

    schema: {
      response: {
        201: { $ref: 'sessionSchema' },
      },
    },
  });

  app.delete('/:sessionId', {
    preHandler: [validateParamIds],

    async handler(request, reply) {
      const { sessionId } = request.params as SessionId;

      await app.prisma.session.delete({ where: { sessionId } });

      reply.code(204).send();
    },

    errorHandler(error, request, reply) {
      if (error.code === 'P2016') {
        reply.send(new NotFoundError('session does not exist'));
      } else {
        app.errorHandler(error, request, reply);
      }
    },
  });

  done();
};

export default sessionRouter;
