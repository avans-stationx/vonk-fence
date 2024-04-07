import React, { useEffect, useState } from 'react';
import { useAudioSystem } from './useAudioSystem';

export function useAudioInterruptListener(
  interrupt: () => void,
  interruptGroups: string[],
) {
  const { addInterruptListener, removeInterruptListener } = useAudioSystem();
  const [isInterrupted, setIsInterrupted] = useState<boolean>(false);

  useEffect(() => {
    function interruptHandler(interrupted: boolean) {
      if (interrupted) {
        interrupt();
      }

      setIsInterrupted(interrupted);
    }

    if (!interruptGroups) {
      return;
    }

    for (let group of interruptGroups) {
      addInterruptListener(group, interruptHandler);
    }

    return () => {
      for (let group of interruptGroups) {
        removeInterruptListener(group, interruptHandler);
      }
    };
  }, [
    addInterruptListener,
    removeInterruptListener,
    interruptGroups,
    interrupt,
  ]);

  return isInterrupted;
}
