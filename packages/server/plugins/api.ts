import { FastifyPluginCallback as Plugin } from 'fastify';
import sessions from '~/routes/api/sessions';
import decks from '~/routes/api/decks';

const apiPlugin: Plugin = async (app, opts, done) => {
  app.addSchema({
    $id: 'errorSchema',
    type: 'object',
    properties: {
      code: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' },
    },
  });

  app.register(sessions, { prefix: 'sessions' });
  app.register(decks, { prefix: 'decks' });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      code: reply.statusCode,
      error: 'Unknown endpoint',
      message: 'Requested endpoint does not exist',
    });
  });

  app.setErrorHandler((error, request, reply) => {
    switch (error.code) {
      default:
        reply.code(500).send({
          code: reply.statusCode,
          error: 'Internal error',
          message: 'Unknown internal error occurred',
        });
        break;
    }
  });

  done();
};

export default apiPlugin;

export const autoPrefix = '/api';
