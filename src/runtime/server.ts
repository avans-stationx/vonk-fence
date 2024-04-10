import http from 'http';
import Express from 'express';
import Next from 'next';
import { AddressInfo } from 'net';
import { networkInterfaces } from 'os';

export async function createServer(photoPath: string, audioPath: string) {
  const app = Express();

  const server = http.createServer(app);

  const next = Next({
    customServer: true,
    hostname: 'localhost',
    dev: process.env.NODE_ENV != 'production',
  });

  app.use('/photos', Express.static(photoPath));
  app.use('/audio', Express.static(audioPath));

  let leftGain = 0.5;
  let rightGain = 0.5;

  app.get('/volume', (request, response) =>
    response.json({ leftGain, rightGain }),
  );

  app.get('/ip-address', (request, response) => {
    const networks = networkInterfaces();

    const addresses: string[] = [];

    for (let networkName of Object.keys(networks)) {
      for (const net of networks[networkName]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
        if (net.family == familyV4Value && !net.internal) {
          addresses.push(net.address);
        }
      }
    }

    response.json({ ips: addresses });
  });

  function setGains(left, right) {
    leftGain = left;
    rightGain = right;
  }

  const nextHandler = next.getRequestHandler();
  app.all('*', (request, response) => nextHandler(request, response));

  await next.prepare();

  return {
    server,
    setGains,
  };
}
