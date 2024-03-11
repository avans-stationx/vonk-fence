import { AddressInfo } from 'net';
import { startClient } from './client';
import { createServer } from './server';

async function main() {
  const server = await createServer();
  server.listen();

  const { port } = server.address() as AddressInfo;

  await startClient(port);
}

main();
