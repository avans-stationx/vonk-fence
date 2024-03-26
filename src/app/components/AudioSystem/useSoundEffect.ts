import React, { useEffect } from 'react';
import { useAudioSystem } from './useAudioSystem';

export function useSoundEffect(
  src: string,
  loop: boolean,
  channel: 'left' | 'right',
  interruptGroup?: string,
) {
  const {
    context,
    leftChannel,
    rightChannel,
    triggerInterrupt,
    clearInterrupt,
    addInterruptListener,
    removeInterruptListener,
  } = useAudioSystem();
  let audioBuffer: AudioBuffer;
  let audioSource: AudioBufferSourceNode;
  let isInterrupted: boolean = false;

  fetch(src)
    .then((response) => response.arrayBuffer())
    .then((audioData) => context.decodeAudioData(audioData))
    .then((buffer) => (audioBuffer = buffer));

  useEffect(() => {
    if (!interruptGroup) {
      return;
    }

    addInterruptListener(interruptGroup, interrupt);

    return () => {
      removeInterruptListener(interruptGroup, interrupt);
    };
  }, []);

  function fire(interruptGroups?: string[]) {
    if (isInterrupted) {
      return;
    }

    if (interruptGroups) {
      interruptGroups.forEach((group) => triggerInterrupt(group));
    }

    audioSource?.stop();

    audioSource = context.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.loop = loop;

    if (interruptGroups) {
      audioSource.addEventListener('ended', () => {
        interruptGroups.forEach((group) => clearInterrupt(group));
      });
    }

    if (channel == 'left') {
      audioSource.connect(leftChannel);
    } else {
      audioSource.connect(rightChannel);
    }

    audioSource.start();
  }

  function stop() {
    audioSource?.stop();
  }

  function interrupt(interrupted: boolean) {
    if (interrupted) {
      stop();
    }

    isInterrupted = interrupted;
  }

  return { fire, stop };
}
