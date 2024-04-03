import React from 'react';
import path from 'path';
import { promises as fs } from 'fs';
import SlidingAnimation from '../components/GalleryPhotoDisplay/SlidingAnimation';

const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);
const photoPath = path.join(storagePath, 'photos');

const Overview: React.FC = async () => {
  async function getPhotos(): Promise<string[]> {
    return await fs.readdir(photoPath);
  }

  const photoRadius = 300;
  const photoCount = 6;
  const photos = await getPhotos();

  async function getRandomPhoto(): Promise<string> {
    'use server';

    const photo = photos[Math.floor(Math.random() * photos.length)];

    return `/photos/${photo}`;
  }

  const initialFirstRow = await Promise.all(
    Array(photoCount)
      .fill(undefined)
      .map(() => getRandomPhoto()),
  );
  const initialSecondRow = await Promise.all(
    Array(photoCount)
      .fill(undefined)
      .map(() => getRandomPhoto()),
  );
  const initialThirdRow = await Promise.all(
    Array(photoCount)
      .fill(undefined)
      .map(() => getRandomPhoto()),
  );

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2250">
      <defs>
        <clipPath id="photo-circle">
          <circle r={photoRadius} cx={photoRadius} cy={photoRadius} />
        </clipPath>
        <linearGradient
          id="linear-gradient"
          x1="431.14"
          y1="127.4"
          x2="3517.49"
          y2="2102.1"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#d9443b" />
          <stop offset=".93" stopColor="#ef651e" />
        </linearGradient>
      </defs>
      <rect width="3840" height="2250" fill="url(#linear-gradient)" />
      <SlidingAnimation
        photoCount={photoCount}
        initialPhotos={initialFirstRow}
        direction="left"
        duration="5s"
        getPhoto={getRandomPhoto}
        width={3840}
        y={100}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
      <SlidingAnimation
        photoCount={photoCount}
        initialPhotos={initialSecondRow}
        direction="right"
        duration="5s"
        getPhoto={getRandomPhoto}
        width={3840}
        y={850}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
      <SlidingAnimation
        photoCount={photoCount}
        initialPhotos={initialThirdRow}
        direction="left"
        duration="5s"
        getPhoto={getRandomPhoto}
        width={3840}
        y={1600}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
    </svg>
  );
};

export default Overview;
