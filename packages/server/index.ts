import createApp from '~/app';

require('dotenv').config();

declare global {
  namespace NodeJS {
    interface Process {
      isDev: boolean;
    }
  }
}

process.isDev = process.env.NODE_ENV === 'development';

const server = createApp({
  logger: process.isDev ? { prettyPrint: true } : false,
});

server.listen(process.env.PORT || 3000, (err, address) => {
  if (err) {
    throw err;
  }

  server.log.info(`server listening on ${address}`);
});

process.on('SIGINT', () => {
  server.close();
});
