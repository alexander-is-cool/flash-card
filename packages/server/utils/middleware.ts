import type { preHandlerHookHandler as Middleware } from 'fastify';
import * as uuid from 'uuid';
import jwt from 'jwt-simple';

import type { TokenPayload, SessionId, Params } from '~/types';
import { AuthenticationError, UserInputError } from '~/utils/errors';

declare module 'fastify' {
  interface FastifyRequest {
    tokenPayload: TokenPayload | null;
  }
}

export const authenticate: Middleware = (request, reply, next) => {
  const { authorization } = request.headers;
  request.tokenPayload = null;

  if (authorization) {
    const [schema, token] = authorization.split(' ');

    if (schema.toLowerCase() === 'bearer' && token) {
      const payload: TokenPayload = jwt.decode(
        token,
        process.env.SECRET as string,
      );

      if (payload.exp > Date.now()) {
        request.tokenPayload = payload;

        next();
      }
    }
  }

  if (!request.tokenPayload) {
    reply.send(new AuthenticationError('credentials missing or expired'));
  }
};

export const validateParamIds: Middleware = (request, reply, next) => {
  const validIds = Object.entries(request['params'] as Params).every(
    ([param, id]) => {
      if (param.endsWith('Id')) {
        return uuid.validate(id);
      }

      return true;
    },
  );

  if (validIds) {
    next();
  } else {
    reply.send(new UserInputError('refresh token provided is not valid'));
  }
};
