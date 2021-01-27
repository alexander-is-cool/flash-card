export interface SessionId {
  sessionId: string;
}

export interface UserId {
  userId: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface Session {
  accessToken: string;
  sessionId: string;
  expiresIn: number;
}

export interface Error {
  error: string;
  message: string;
  statusCode: string;
}

export type Params = {
  [key: string]: string;
};
