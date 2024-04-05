import http from 'http';
import Express from 'express';
import Next from 'next';

export async function createServer(photoPath: string) {
  const app = Express();

  const next = Next({
    customServer: true,
    hostname: 'localhost',
    dev: process.env.NODE_ENV != 'production',
  });

  app.use('/photos', Express.static(photoPath));

  let leftGain = 0.5;
  let rightGain = 0.5;

  app.get('/volume', (request, response) =>
    response.json({ leftGain, rightGain }),
  );

  function setGains(left, right) {
    leftGain = left;
    rightGain = right;
  }

  const nextHandler = next.getRequestHandler();
  app.all('*', (request, response) => nextHandler(request, response));

  await next.prepare();

  return {
    server: http.createServer(app),
    setGains,
  };
}
