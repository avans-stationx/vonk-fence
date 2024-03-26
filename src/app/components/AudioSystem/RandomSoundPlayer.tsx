'use client';

import React, { useEffect } from 'react';
import { useRandomSoundEffectPlaylist } from './useRandomSoundEffectPlaylist';

type RandomSoundPlayerProps = {
  sounds: string[];
  channel: 'left' | 'right';
  intervalMillis?: number;
  pause?: boolean;
  interruptGroup?: string;
  sendInterrupt?: string[];
};

const RandomSoundPlayer: React.FC<RandomSoundPlayerProps> = ({
  sounds,
  channel,
  intervalMillis,
  pause,
  interruptGroup,
  sendInterrupt,
}) => {
  const { fire } = useRandomSoundEffectPlaylist(
    sounds,
    channel,
    interruptGroup,
    sendInterrupt,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        fire();
      }
    }, intervalMillis ?? 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div></div>;
};

export default RandomSoundPlayer;
