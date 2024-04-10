import { useEffect, useRef } from 'react';
import { useAudioInterruptListener } from './useAudioInterruptListener';
import { useAudioInterruptSource } from './useAudioInterruptSource';
import { createSoundEffectSource, fetchSoundEffect } from './sound-effect';
import { useAudioSystem } from './useAudioSystem';

export function useRandomSoundEffectPlaylist(
  sounds: string[],
  channel: 'left' | 'right',
  interruptGroups?: string[],
  sendInterrupt?: string[],
) {
  const { context, leftChannel, rightChannel } = useAudioSystem();
  const isInterrupted = useAudioInterruptListener(stop, interruptGroups);
  const { trigger, clear } = useAudioInterruptSource(sendInterrupt ?? []);
  const playlist = useRef<AudioBuffer[]>([]);
  let currentlyPlaying: AudioBufferSourceNode;

  useEffect(() => {
    Promise.all(sounds.map((sound) => fetchSoundEffect(sound, context))).then(
      (buffers) => (playlist.current = buffers),
    );
  });

  function fire() {
    if (isInterrupted) {
      return;
    }

    const effect =
      playlist.current[Math.floor(Math.random() * playlist.current.length)];

    currentlyPlaying = createSoundEffectSource(
      context,
      effect,
      channel == 'left' ? leftChannel : rightChannel,
      false,
      clear,
    );

    trigger();
    currentlyPlaying.start();
  }

  function stop() {
    clear();
    currentlyPlaying?.stop();
  }

  return { fire, stop };
}
