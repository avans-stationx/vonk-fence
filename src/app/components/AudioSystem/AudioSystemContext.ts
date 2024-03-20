'use client';

import { createContext } from 'react';

type AudioSystemContextProps = {
  context: AudioContext;
  leftChannel: StereoPannerNode;
  rightChannel: StereoPannerNode;
};

const context = new AudioContext({
  sampleRate: 48000,
});

const leftChannel = new StereoPannerNode(context, {
  pan: -1,
});

leftChannel.connect(context.destination);

const rightChannel = new StereoPannerNode(context, {
  pan: 1,
});

rightChannel.connect(context.destination);

export const defaultAudioSystemContext: AudioSystemContextProps = {
  context,
  leftChannel,
  rightChannel,
};

export const AudioSystemContext = createContext<AudioSystemContextProps>(
  defaultAudioSystemContext,
);
