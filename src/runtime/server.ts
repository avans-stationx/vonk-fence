import http from 'http';
import Express from 'express';
import Next from 'next';
import config from './next.config';

export async function createServer(): Promise<http.Server> {
  const app = Express();

  const next = Next({
    customServer: true,
    hostname: 'localhost',
    conf: config,
    dev: process.env.NODE_ENV != 'production',
  });

  const nextHandler = next.getRequestHandler();
  app.all('*', (request, response) => nextHandler(request, response));

  await next.prepare();

  return http.createServer(app);
}
