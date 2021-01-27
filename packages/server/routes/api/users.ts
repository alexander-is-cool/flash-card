import type { FastifyPluginCallback as Plugin } from 'fastify';
import bcrypt from 'bcrypt';

import type { Credentials, TokenPayload, UserId } from '~/types';
import { ConflictError, ForbiddenError, NotFoundError } from '~/utils/errors';
import { authenticate, validateParamIds } from '~/utils/middleware';

const userRouter: Plugin = (app, opts, done) => {
  app.get('/', {
    handler(request, reply) {
      reply.send('hello');
    },
  });

  app.get('/:userId', {
    preHandler: [validateParamIds, authenticate],

    async handler(request, reply) {
      const { userId } = request.params as UserId;
      const { sub } = request.tokenPayload as TokenPayload;

      if (userId === sub) {
        const user = await app.prisma.user.findUnique({
          where: { userId: sub },
          select: { userId: true, username: true, decks: true },
        });

        reply.send(user ? user : new NotFoundError('user does not exist'));
      } else {
        reply.send(
          new ForbiddenError('you do not have access to this users info'),
        );
      }
    },
  });

  app.get('/me', {
    async handler(request, reply) {
      // TODO
    },
  });

  app.post('/', {
    async handler(request, reply) {
      const { username, password } = request.body as Credentials;

      const createdUser = await app.prisma.user.create({
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 10),
        },
        select: { userId: true, username: true },
      });

      const session = await app.generateSession(createdUser.userId);

      reply.code(201).send(session);
    },

    errorHandler(error, request, reply) {
      if (error.code === 'P2002') {
        reply.send(new ConflictError('username is taken'));
      } else {
        app.errorHandler(error, request, reply);
      }
    },

    schema: {
      body: {
        $ref: 'credentialsSchema',
      },
      response: {
        200: { $ref: 'sessionSchema' },
      },
    },
  });

  app.put('/:userId', {
    async handler(request, reply) {
      // TODO
    },
  });

  app.delete('/:userId', {
    preHandler: [validateParamIds, authenticate],

    async handler(request, reply) {
      const { userId } = request.params as UserId;
      const { sub } = request.tokenPayload as TokenPayload;

      if (userId === sub) {
        await app.prisma.user.delete({
          where: { userId: sub },
        });

        reply.code(204).send();
      } else {
        reply.send(
          new ForbiddenError('you do not have access to delete this user'),
        );
      }
    },
  });

  done();
};

export default userRouter;
