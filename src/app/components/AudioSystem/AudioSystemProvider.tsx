'use client';

import React from 'react';
import {
  AudioSystemContext,
  buildDefaultAudioSystemContext,
} from './AudioSystemContext';

type AudioSystemProviderProps = {
  children: React.ReactNode;
};

const AudioSystemProvider: React.FC<AudioSystemProviderProps> = ({
  children,
}) => {
  return (
    <AudioSystemContext.Provider value={buildDefaultAudioSystemContext()}>
      {children}
    </AudioSystemContext.Provider>
  );
};

export default AudioSystemProvider;
