'use client';

import React, { useEffect, useRef } from 'react';
import { useAudioSystem } from './useAudioSystem';

type BackgroundAudioProps = {
  src: string;
  loop?: boolean;
  channel: 'left' | 'right';
  play: boolean;
};

const BackgroundAudio: React.FC<BackgroundAudioProps> = ({
  src,
  loop,
  channel,
  play,
}) => {
  const audio = useRef<HTMLAudioElement>();
  const { context, leftChannel, rightChannel } = useAudioSystem();
  let source: MediaElementAudioSourceNode;

  useEffect(() => {
    if (!audio.current || source) {
      return;
    }

    source = context.createMediaElementSource(audio.current);

    if (channel == 'left') {
      source.connect(leftChannel);
    } else {
      source.connect(rightChannel);
    }
  }, [channel, context, leftChannel, rightChannel]);

  useEffect(() => {
    if (!audio.current || !source) {
      return;
    }

    if (play) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  }, [audio, source, play]);

  return <audio src={src} ref={audio} loop={loop} />;
};

export default BackgroundAudio;
