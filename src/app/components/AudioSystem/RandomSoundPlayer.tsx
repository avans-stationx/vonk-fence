'use client';

import React, { useEffect } from 'react';
import { useRandomSoundEffectPlaylist } from './useRandomSoundEffectPlaylist';

type RandomSoundPlayerProps = {
  sounds: string[];
  channel: 'left' | 'right';
  intervalMillis?: number;
  pause?: boolean;
  interruptGroups?: string[];
  sendInterrupt?: string[];
};

const RandomSoundPlayer: React.FC<RandomSoundPlayerProps> = ({
  sounds,
  channel,
  intervalMillis,
  pause,
  interruptGroups,
  sendInterrupt,
}) => {
  const { fire } = useRandomSoundEffectPlaylist(
    sounds,
    channel,
    interruptGroups ?? [],
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
  }, [fire, intervalMillis, pause]);

  return null;
};

export default RandomSoundPlayer;
