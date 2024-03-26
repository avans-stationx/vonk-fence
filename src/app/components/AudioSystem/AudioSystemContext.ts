'use client';

import { createContext } from 'react';

export type AudioSystemContextProps = {
  context?: AudioContext;
  leftChannel?: StereoPannerNode;
  rightChannel?: StereoPannerNode;
  triggerInterrupt: (group: string) => void;
  clearInterrupt: (group: string) => void;
  addInterruptListener: (
    group: string,
    listener: (interrupted: boolean) => void,
  ) => void;
  removeInterruptListener: (
    group: string,
    listener: (interrupted: boolean) => void,
  ) => void;
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

let interruptListeners: Record<string, ((interrupted: boolean) => void)[]> = {};

export const defaultAudioSystemContext: AudioSystemContextProps = {
  context,
  leftChannel,
  rightChannel,
  triggerInterrupt(group) {
    if (!interruptListeners[group]) {
      return;
    }

    interruptListeners[group].forEach((listener) => listener(true));
  },
  clearInterrupt(group) {
    if (!interruptListeners[group]) {
      return;
    }

    interruptListeners[group].forEach((listener) => listener(false));
  },
  addInterruptListener(group, listener) {
    if (!interruptListeners[group]) {
      interruptListeners[group] = [];
    }

    interruptListeners[group].push(listener);
  },
  removeInterruptListener(group, listener) {
    if (!interruptListeners[group]) {
      return;
    }

    interruptListeners[group] = interruptListeners[group].filter(
      (existingListener) => existingListener != listener,
    );
  },
};

export const AudioSystemContext = createContext<AudioSystemContextProps>(
  defaultAudioSystemContext,
);
