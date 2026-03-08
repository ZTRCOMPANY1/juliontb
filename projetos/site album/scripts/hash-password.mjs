import { createHash } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.log('Uso: node hash-password.mjs SUA_SENHA');
  process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');
console.log(hash);
