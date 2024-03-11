'use client';

import React, { useEffect, useRef } from 'react';

type AudioPlayerProps = {
  src: string;
  repeat?: boolean;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, repeat }) => {
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    function handleRepeat(event: Event) {
      if (repeat) {
        (event.target as HTMLAudioElement).play();
      }
    }

    const instance = player.current;

    instance?.play();
    instance?.addEventListener('ended', handleRepeat);

    return () => instance?.removeEventListener('ended', handleRepeat);
  }, [src, repeat]);

  return <audio src={src} ref={player} />;
};

export default AudioPlayer;
