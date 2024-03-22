import path from 'path';
import { AddressInfo } from 'net';
import { startClient } from './client';
import { createServer } from './server';
import { vonk_fence } from './generated_protos/protos';
import CameraBridge from './camera-bridge';
import FirmwareBridge from './firmware-bridge';

async function main() {
  const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);

  // const server = await createServer();
  // server.listen();

  // const { port } = server.address() as AddressInfo;

  // const trigger = await startClient(port);

  const camera = new CameraBridge();

  const firmware = new FirmwareBridge();
  await firmware.startCommunication();
  firmware.enablePing();

  const firmwareSetupMessage = new vonk_fence.FirmwareIn({
    flashRequest: {
      duration: 300,
    },
    dataRequest: {
      volume: true,
      regionOfInterest: true,
    },
  });

  firmware.sendRequest(firmwareSetupMessage);

  firmware.on('detected', (timestamp) => {
    firmware.sendRequest(
      new vonk_fence.FirmwareIn({
        flashRequest: {
          strobe: true,
        },
      }),
    );

    camera.sendRequest(
      new vonk_fence.CameraIn({
        photoRequest: {
          timestamp: Date.now(),
          storagePath,
        },
      }),
    );
  });

  firmware.on('region-of-interest', (left, top) => {
    camera.sendRequest(
      new vonk_fence.CameraIn({
        regionOfInterest: {
          left,
          top,
        },
      }),
    );
  });
}

main();
