'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AutoNavigatorProps = {
  href: string;
  delay: number;
};

const AutoNavigator: React.FC<AutoNavigatorProps> = ({ href, delay }) => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(href);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, href, delay]);

  return null;
};

export default AutoNavigator;
