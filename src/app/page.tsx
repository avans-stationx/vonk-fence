import React from 'react';
import AutoNavigator from './components/AutoNavigator';
import PortNumber from './components/PortNumber';

const Home: React.FC = () => {
  return (
    <main>
      <AutoNavigator href="/overview" delay={5000} />
      <h1>VONK Fence Installation</h1>
      <h2>Powered by StationX</h2>
      <PortNumber />
    </main>
  );
};

export default Home;
