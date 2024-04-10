import React from 'react';
import AutoNavigator from './components/AutoNavigator';
import PortNumber from './components/PortNumber';
import IpAddresses from './components/IpAddresses';

const Home: React.FC = () => {
  return (
    <main>
      <AutoNavigator href="/overview" delay={20000} />
      <h1>VONK Fence Installation</h1>
      <h2>Powered by StationX</h2>
      <IpAddresses />
      <PortNumber />
    </main>
  );
};

export default Home;
