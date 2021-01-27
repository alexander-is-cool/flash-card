CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	user_id UUID DEFAULT uuid_generate_v4(),

	username VARCHAR(50) UNIQUE NOT NULL,
	password_hash CHAR(60) NOT NULL,

	created_at TIMESTAMP NOT NULL DEFAULT NOW(),

	PRIMARY KEY (user_id)
);

CREATE TABLE sessions (
  user_id UUID NOT NULL,

  session_id UUID UNIQUE NOT NULL,
  session_expiration TIMESTAMP,

  PRIMARY KEY (session_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE decks (
	deck_id UUID DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,

	deck_name VARCHAR(50),

	created_at TIMESTAMP NOT NULL DEFAULT NOW(),

	PRIMARY KEY (deck_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE cards (
	deck_id UUID NOT NULL,
	card_index INT NOT NULL,

	front TEXT NOT NULL,
	back TEXT NOT NULL,

	created_at TIMESTAMP NOT NULL DEFAULT NOW(),

	PRIMARY KEY (deck_id, card_index),
	FOREIGN KEY (deck_id) REFERENCES decks (deck_id) ON DELETE CASCADE
);
