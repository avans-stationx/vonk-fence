import { useState } from 'react';
import { useAudioSystem } from './useAudioSystem';

export function useAudioInterruptSource(groups: string[]) {
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const { triggerInterrupt, clearInterrupt } = useAudioSystem();

  function trigger() {
    if (!isTriggered) {
      groups.forEach(triggerInterrupt);
      setIsTriggered(true);
    }
  }

  function clear() {
    if (isTriggered) {
      groups.forEach(clearInterrupt);
      setIsTriggered(false);
    }
  }

  return {
    trigger,
    clear,
    isTriggered,
  };
}
