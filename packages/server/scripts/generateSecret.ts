#!/usr/bin/env ts-node
import { writeFileSync } from 'fs';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

const envVars = dotenv.config();

if (envVars.error) {
  throw envVars.error;
} else {
  Object.assign(envVars.parsed, {
    SECRET: uuid(),
  });

  writeFileSync(
    '.env',
    Object.entries(envVars.parsed as object).reduce(
      (vars, [key, value]) => `${vars}${key}=${value}\n`,
      '',
    ),
  );
}
