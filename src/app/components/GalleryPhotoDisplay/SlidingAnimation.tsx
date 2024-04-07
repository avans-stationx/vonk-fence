'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type SlidingAnimationProps = Omit<
  React.SVGProps<SVGGElement>,
  'transform' | 'width' | 'y'
> & {
  photoCount: number;
  initialPhotos: string[];
  getPhoto: () => Promise<string>;
  photoProps?: Omit<React.SVGProps<SVGImageElement>, 'href' | 'transform'>;
  duration: string;
  direction: 'left' | 'right';
  width: number;
  y?: number;
};

const SlidingAnimation: React.FC<SlidingAnimationProps> = ({
  photoCount,
  initialPhotos,
  getPhoto,
  photoProps,
  duration,
  direction,
  width,
  y,
  ...props
}) => {
  const animation = useRef<SVGAnimateTransformElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const spacing = width / (photoCount - 1);

  const getPhotoCallback = useCallback(getPhoto, [getPhoto]);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [photoCount, initialPhotos]);

  useEffect(() => {
    if (!animation.current) {
      return;
    }

    const element = animation.current;

    async function handleRepeat() {
      const photo = await getPhotoCallback();

      if (direction == 'left') {
        setPhotos((oldPhotos) => [...oldPhotos.slice(1), photo]);
      } else {
        setPhotos((oldPhotos) => [photo, ...oldPhotos.slice(0, -1)]);
      }
    }

    element.addEventListener('repeatEvent', handleRepeat);

    return () => {
      element.removeEventListener('repeatEvent', handleRepeat);
    };
  }, [animation, direction, getPhotoCallback]);

  return (
    <g {...props}>
      {photos &&
        photos.map((photo, index) => (
          <image
            key={photo}
            href={photo}
            transform={`translate(${index * spacing}, 0)`}
            {...photoProps}
          />
        ))}
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        from={`${direction == 'left' ? 0 : -spacing} ${y ?? 0}`}
        to={`${direction == 'left' ? -spacing : 0} ${y ?? 0}`}
        dur={duration}
        repeatCount="indefinite"
        ref={animation}
      />
    </g>
  );
};

export default SlidingAnimation;
