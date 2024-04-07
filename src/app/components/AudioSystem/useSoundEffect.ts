import { useAudioSystem } from './useAudioSystem';
import { useAudioInterruptListener } from './useAudioInterruptListener';
import { createSoundEffectSource, fetchSoundEffect } from './sound-effect';
import { useEffect, useRef } from 'react';

export function useSoundEffect(
  src: string,
  loop: boolean,
  channel: 'left' | 'right',
  interruptGroups?: string[],
  onEnd?: () => void,
) {
  const { context, leftChannel, rightChannel } = useAudioSystem();
  const isInterrupted = useAudioInterruptListener(stop, interruptGroups ?? []);

  let audioBuffer = useRef<AudioBuffer>();
  let audioSource: AudioBufferSourceNode;

  useEffect(() => {
    fetchSoundEffect(src, context).then(
      (buffer) => (audioBuffer.current = buffer),
    );
  });

  function fire() {
    if (isInterrupted) {
      return;
    }

    audioSource?.stop();

    audioSource = createSoundEffectSource(
      context,
      audioBuffer.current,
      channel == 'left' ? leftChannel : rightChannel,
      loop,
      onEnd,
    );

    audioSource.start();
  }

  function stop() {
    audioSource?.stop();
  }

  return { fire, stop };
}
