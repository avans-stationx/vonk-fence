import React from 'react';
import path from 'path';
import { promises as fs } from 'fs';
import RandomDesign from '../components/SinglePhotoDisplay/RandomDesign';
import { DesignProps } from '../components/SinglePhotoDisplay/design-props';

async function getLatestPhoto(): Promise<DesignProps> {
  try {
    const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);
    const photoPath = path.join(storagePath, 'photos');
    const serialPath = path.join(storagePath, 'serial.bin');

    const buffer = await fs.readFile(serialPath);
    const serialNumber = buffer.readUint32BE();

    const files = await fs.readdir(photoPath);
    const [file] = files
      .filter((file) => file.startsWith(`${serialNumber}_`))
      .sort((a, b) => {
        const regex = /^\d+_(\d+)\.jpg$/;

        const [aTime] = regex.exec(a);
        const [bTime] = regex.exec(b);

        return Number(bTime) - Number(aTime);
      });

    return {
      photo: `/photos/${file}`,
      serialNumber,
    };
  } catch {
    return {
      photo: 'https://picsum.photos/1500',
      serialNumber: 0,
    };
  }
}

const Single: React.FC = async () => {
  const photo = await getLatestPhoto();

  return <RandomDesign {...photo} />;
};

export default Single;
