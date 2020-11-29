import { FastifyPluginCallback as Plugin } from 'fastify';

const deckRouter: Plugin = (app, opts, done) => {
  app.get('/', (request, reply) => {
    reply.send('decks');
  });

  done();
};

export default deckRouter;
