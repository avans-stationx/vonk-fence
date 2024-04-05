'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRandomSoundEffectPlaylist } from './AudioSystem/useRandomSoundEffectPlaylist';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';
import { useAudioSystem } from './AudioSystem/useAudioSystem';

const EventHandler: React.FC = () => {
  const router = useRouter();
  const { setGains } = useAudioSystem();

  const { fire } = useRandomSoundEffectPlaylist(
    [
      '/audio/10_Sluiter_MONO.wav',
      '/audio/11_Sluiter_MONO.wav',
      '/audio/12_Sluiter_MONO.wav',
      '/audio/13_Sluiter_MONO.wav',
      '/audio/14_Sluiter_MONO.wav',
      '/audio/15_Sluiter_MONO.wav',
      '/audio/16_Sluiter_MONO.wav',
    ],
    'right',
    undefined,
    ['ralf'],
  );

  useKeyboardEvent('f', () => fire());
  useKeyboardEvent('s', () => router.push(`/single?r=${Math.random()}`));
  useKeyboardEvent('o', () => router.push('/overview'));
  useKeyboardEvent('v', () => {
    fetch('/volume')
      .then((response) => response.json())
      .then(({ leftGain, rightGain }) => setGains(leftGain, rightGain));
  });

  return <div></div>;
};

export default EventHandler;
