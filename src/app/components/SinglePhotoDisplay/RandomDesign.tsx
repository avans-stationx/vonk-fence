import React from 'react';
import { DesignProps } from './design-props';
import DesignOne from './DesignOne/DesignOne';
import DesignTwo from './DesignTwo/DesignTwo';
import DesignThree from './DesignThree/DesignThree';

type DesignIndex = {
  component: React.ReactNode;
  weight: number;
};

const RandomDesign: React.FC<DesignProps> = (props) => {
  const designs: DesignIndex[] = [
    {
      component: <DesignOne {...props} />,
      weight: 1,
    },
    {
      component: <DesignTwo {...props} />,
      weight: 1,
    },
    {
      component: <DesignThree {...props} />,
      weight: 1,
    },
  ];

  function chooseDesignWeighted(): React.ReactNode {
    let options: React.ReactNode[] = [];

    designs.forEach(({ component, weight }) => {
      for (let i = 0; i < weight; i++) {
        options.push(component);
      }
    });

    const index = Math.floor(Math.random() * designs.length);

    return options[index];
  }

  return chooseDesignWeighted();
};

export default RandomDesign;
