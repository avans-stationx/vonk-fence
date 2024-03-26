'use client';

import { useEffect } from 'react';

export function useKeyboardEvent(
  key: string,
  handler: (event: KeyboardEvent) => void,
  target?: HTMLElement,
) {
  useEffect(() => {
    function keyHandler(event: KeyboardEvent) {
      if (event.key == key) {
        event.preventDefault();
        handler(event);
      }
    }

    (target ?? document.body).addEventListener('keyup', keyHandler);

    return () => {
      (target ?? document.body).removeEventListener('keyup', keyHandler);
    };
  }, [key, handler, target]);
}
