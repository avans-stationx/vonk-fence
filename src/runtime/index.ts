import path from 'path';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { AddressInfo } from 'net';
import { startClient } from './client';
import { createServer } from './server';
import { vonk_fence } from './generated_protos/protos.js';
import CameraBridge from './camera-bridge';
import FirmwareBridge from './firmware-bridge';

async function main() {
  const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);
  const photoPath = path.join(storagePath, 'photos');

  const audioPath = path.resolve(
    __dirname,
    process.env.NODE_ENV != 'production'
      ? '../../public/audio'
      : '../public/audio',
  );

  const { server, setGains } = await createServer(photoPath, audioPath);
  server.listen(
    process.env.NODE_ENV != 'production' ? 3000 : undefined,
    '0.0.0.0',
  );

  const { port } = server.address() as AddressInfo;

  const trigger = await startClient(port);

  const camera = new CameraBridge();

  const firmware = new FirmwareBridge();
  await firmware.startCommunication();
  firmware.enablePing();

  const firmwareSetupMessage = new vonk_fence.FirmwareIn({
    flashRequest: {
      duration: 500,
    },
    dataRequest: {
      volume: true,
      regionOfInterest: true,
    },
  });

  await firmware.sendRequest(firmwareSetupMessage);

  firmware.on('detected', (timestamp, testMode) => {
    if (testMode) {
      sendPhotoRequest();
    } else {
      takePhoto();
    }
  });

  firmware.on('volume', (left, right) => {
    setGains(left, right);
    trigger('v');
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

  camera.on('photo-result', (filename, timeTakenMillis, wellKnown) => {
    if (wellKnown) {
      trigger('t');
    } else {
      trigger('s');
    }

    setTimeout(() => trigger('o'), 10000);
  });

  function takePhoto() {
    trigger('f');

    const serialPath = path.join(storagePath, 'serial.bin');

    fs.readFile(serialPath)
      .then((buffer) => buffer.readUInt32BE())
      .catch(() => -1)
      .then(async (oldSerial) => {
        const newSerial = oldSerial + 1;

        await sendPhotoRequest(newSerial);

        const outBuffer = Buffer.alloc(4);
        outBuffer.writeUint32BE(newSerial);

        fs.writeFile(serialPath, outBuffer);
      });
  }

  async function sendPhotoRequest(serial?: number) {
    await firmware.sendRequestWithTimeout(
      new vonk_fence.FirmwareIn({
        flashRequest: {
          strobe: true,
        },
      }),
      500,
    );

    if (serial) {
      camera.sendRequest(
        new vonk_fence.CameraIn({
          photoRequest: {
            timestamp: Date.now(),
            storagePath: photoPath,
            serial,
          },
        }),
      );
    } else {
      camera.sendRequest(
        new vonk_fence.CameraIn({
          photoRequest: {
            timestamp: Date.now(),
            storagePath: tmpdir(),
            serial: 0,
            wellKnown: 'nl.avans.stationx.vonk-fence-test-photo.jpg',
          },
        }),
      );
    }
  }
}

main();
