'use client';

import React, { useEffect, useState } from 'react';

const IpAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    fetch('/ip-address')
      .then((response) => response.json())
      .then(({ ips }) => setAddresses(ips));
  }, []);

  return (
    <>
      <h2>IP addresses</h2>
      {addresses.map((address) => (
        <p key={address}>{address}</p>
      ))}
    </>
  );
};

export default IpAddresses;
