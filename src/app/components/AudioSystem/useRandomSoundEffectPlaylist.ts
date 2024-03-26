import { useSoundEffect } from './useSoundEffect';

export function useRandomSoundEffectPlaylist(
  sounds: string[],
  channel: 'left' | 'right',
  interruptGroup?: string,
  sendInterrupt?: string[],
) {
  let currentlyPlaying: ReturnType<typeof useSoundEffect>;

  const playlist = sounds.map((sound) =>
    useSoundEffect(sound, false, channel, interruptGroup),
  );

  function fire() {
    currentlyPlaying = playlist[Math.floor(Math.random() * playlist.length)];
    currentlyPlaying.fire(sendInterrupt);
  }

  function stop() {
    currentlyPlaying?.stop();
  }

  return { fire, stop };
}
