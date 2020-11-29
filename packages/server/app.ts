import fastify, { FastifyServerOptions } from 'fastify';
import * as autoLoad from 'fastify-autoload';
import { join } from 'path';

declare module 'fastify' {
  interface FastifyInstance {
    rootDir: string;
  }
}

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  app.register(autoLoad as any, {
    dir: join(__dirname, 'plugins'),
  });

  return app;
};

export default createApp;
