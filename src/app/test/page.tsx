import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import styles from './page.module.css';

const photoPath = path.join(
  tmpdir(),
  'nl.avans.stationx.vonk-fence-test-photo.jpg',
);

async function loadPhoto() {
  try {
    const photo = await fs.readFile(photoPath, {
      encoding: 'base64',
    });

    return `data:image/jpeg;base64,${photo}`;
  } catch {
    return 'https://picsum.photos/1500';
  }
}

export const revalidate = 0;

const Test: React.FC = async () => {
  const photo = await loadPhoto();

  return (
    <main className={styles.container}>
      <div>
        <h1>Test photo</h1>
        <p>
          Warning! This is a test photo. Toggle the dial lock switch to turn off
          the testing mode.
        </p>
      </div>
      <div className={styles.photoContainer}>
        <img className={styles.photo} src={photo} alt="Test photo" />
      </div>
    </main>
  );
};

export default Test;
