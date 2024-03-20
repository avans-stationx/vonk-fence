'use client';

import React from 'react';
import {
  AudioSystemContext,
  defaultAudioSystemContext,
} from './AudioSystemContext';

type AudioSystemProviderProps = {
  children: React.ReactNode;
};

const AudioSystemProvider: React.FC<AudioSystemProviderProps> = ({
  children,
}) => {
  return (
    <AudioSystemContext.Provider value={defaultAudioSystemContext}>
      {children}
    </AudioSystemContext.Provider>
  );
};

export default AudioSystemProvider;
