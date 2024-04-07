'use client';

import React, { useEffect, useState } from 'react';

const PortNumber: React.FC = () => {
  const [port, setPort] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window == 'undefined') {
      return;
    }

    setPort(Number(window.location.port));
  }, []);

  return <p>Port: {port}</p>;
};

export default PortNumber;
