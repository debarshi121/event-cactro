const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// Append pgbouncer=true to prevent "prepared statement already exists" errors
// when a connection pooler (e.g. PgBouncer) reuses connections across clients.
function buildDatasourceUrl(base) {
  if (!base) return base;
  const sep = base.includes('?') ? '&' : '?';
  return base.includes('pgbouncer') ? base : `${base}${sep}pgbouncer=true`;
}

const prisma = new PrismaClient({
  datasourceUrl: buildDatasourceUrl(process.env.DATABASE_URL),
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
//   logger.debug(`Query: ${e.query}`);
//   logger.debug(`Params: ${e.params}`);
//   logger.debug(`Duration: ${e.duration}ms`);
});

prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

module.exports = prisma;
