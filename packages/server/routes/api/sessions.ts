import { FastifyPluginCallback as Plugin } from 'fastify';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface Credentials {
  username: string;
  password: string;
}

const sessionRouter: Plugin = (app, opts, done) => {
  const credentialsSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  };

  const tokenSchema = {
    type: 'object',
    properties: {
      token: { type: 'string' },
      refreshToken: { type: 'string' },
    },
  };

  app.get('/', (request, reply) => {
    reply.send('sessions');
  });

  app.post(
    '/signup',
    {
      schema: {
        body: credentialsSchema,
        response: {
          200: tokenSchema,
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body as Credentials;

      const { userId, refreshToken } = await app.prisma.user.create({
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 10),
          refreshToken: uuid4(),
        },
      });

      const token = jwt.sign({ userId }, process.env.SECRET as string, {
        expiresIn: '5min',
      });

      reply.send({ token, refreshToken });
    },
  );

  app.post(
    '/login',
    {
      schema: {
        body: credentialsSchema,
        response: {
          200: tokenSchema,
          401: { $ref: 'errorSchema' },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body as Credentials;

      const user = await app.prisma.user.findOne({
        where: {
          username,
        },
      });

      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const { userId, refreshToken } = await app.prisma.user.update({
          where: {
            username,
          },
          data: {
            refreshToken: uuid4(),
          },
        });

        const token = jwt.sign({ userId }, process.env.SECRET as string, {
          expiresIn: '5min',
        });

        reply.send({ token, refreshToken });
      } else {
        reply.code(401).send({
          code: reply.statusCode,
          error: 'Wrong credentials',
          message: 'The username and password provided does not match',
        });
      }
    },
  );

  done();
};

export default sessionRouter;
