import { useContext } from 'react';
import { AudioSystemContext } from './AudioSystemContext';
import { useKeyboardEvent } from '../../hooks/useKeyboardEvent';

export function useAudioSystem() {
  const audioSystem = useContext(AudioSystemContext);

  useKeyboardEvent('a', () => {
    audioSystem.context.resume();
  });

  return audioSystem;
}
