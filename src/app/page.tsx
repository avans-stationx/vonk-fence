'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/overview');
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main>
      <h1>VONK Fence Installation</h1>
      <h2>Powered by StationX</h2>
    </main>
  );
};

export default Home;
