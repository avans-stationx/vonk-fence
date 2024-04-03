import path from 'path';
import { promises as fs } from 'fs';
import { AddressInfo } from 'net';
import { startClient } from './client';
import { createServer } from './server';
import { vonk_fence } from './generated_protos/protos.js';
import CameraBridge from './camera-bridge';
import FirmwareBridge from './firmware-bridge';

async function main() {
  const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);
  const photoPath = path.join(storagePath, 'photos');

  const server = await createServer(photoPath);
  server.listen();

  const { port } = server.address() as AddressInfo;

  const trigger = await startClient(port);

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

  firmware.on('detected', takePhoto);

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

  camera.on('photo-result', (filename) => {
    trigger('s');
    setTimeout(() => trigger('o'), 10000);
  });

  setInterval(takePhoto, 30000);

  function takePhoto() {
    trigger('f');

    const serialPath = path.join(storagePath, 'serial.bin');

    fs.readFile(serialPath)
      .then((buffer) => buffer.readUInt32BE())
      .catch(() => -1)
      .then(async (oldSerial) => {
        const newSerial = oldSerial + 1;

        await firmware.sendRequestWithTimeout(
          new vonk_fence.FirmwareIn({
            flashRequest: {
              strobe: true,
            },
          }),
          500,
        );

        camera.sendRequest(
          new vonk_fence.CameraIn({
            photoRequest: {
              timestamp: Date.now(),
              storagePath: photoPath,
              serial: newSerial,
            },
          }),
        );

        const outBuffer = Buffer.alloc(4);
        outBuffer.writeUint32BE(newSerial);

        fs.writeFile(serialPath, outBuffer);
      });
  }
}

main();
