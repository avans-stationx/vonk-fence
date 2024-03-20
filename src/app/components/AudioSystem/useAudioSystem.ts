import { useContext } from 'react';
import { AudioSystemContext } from './AudioSystemContext';

export function useAudioSystem() {
  return useContext(AudioSystemContext);
}
