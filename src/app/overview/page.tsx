import React from 'react';
import path from 'path';
import { promises as fs } from 'fs';
import SlidingAnimation from '../components/GalleryPhotoDisplay/SlidingAnimation';
import styles from './page.module.css';

export const revalidate = 0;

const Overview: React.FC = async () => {
  async function getPhotos(): Promise<string[]> {
    try {
      const storagePath = path.resolve(process.env['VONK_MOUNT_POINT']);
      const photoPath = path.join(storagePath, 'photos');

      return await fs.readdir(photoPath);
    } catch {
      return [];
    }
  }

  const photoRadius = 250;
  const photoCount = 8;
  const photos = await getPhotos();
  const lineHeight = 140;

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
        y={50}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
      <SlidingAnimation
        photoCount={photoCount}
        initialPhotos={initialSecondRow}
        direction="right"
        duration="8s"
        getPhoto={getRandomPhoto}
        width={3840}
        y={600}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
      <SlidingAnimation
        photoCount={photoCount}
        initialPhotos={initialThirdRow}
        direction="left"
        duration="3s"
        getPhoto={getRandomPhoto}
        width={3840}
        y={1150}
        photoProps={{
          width: photoRadius * 2,
          clipPath: 'url(#photo-circle)',
        }}
      />
      <text className={styles.callToAction} transform="translate(1920, 1850)">
        <tspan>Als je jouw naam en e-mailadres hier op de lijst schrijft</tspan>
        <tspan x="0" dy={lineHeight}>
          of als je jezelf aanmeldt via
        </tspan>
        <tspan className={styles.website} dx="20">
          roadtrip.avans-evenementen.nl
        </tspan>
        <tspan>,</tspan>
        <tspan className={styles.payoff} x="0" dy={lineHeight}>
          dan gluur ik voor deze keer door mijn vingers!
        </tspan>
      </text>
    </svg>
  );
};

export default Overview;
