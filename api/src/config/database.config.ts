import { registerAs } from '@nestjs/config';

function parseUrl(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: parseInt(u.port) || 5432,
    name: u.pathname.slice(1),
    username: u.username,
    password: u.password,
  }
}

export default registerAs('database', () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (url) return parseUrl(url)
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB || 'angaza',
    username: process.env.POSTGRES_USER || 'angaza',
    password: process.env.POSTGRES_PASSWORD || 'changeme',
  }
})
