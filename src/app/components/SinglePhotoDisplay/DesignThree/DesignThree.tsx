import React from 'react';
import TemplateOne from '../TemplateOne/TemplateOne';
import { DesignProps } from '../design-props';
import styles from './DesignThree.module.css';

const DesignThree: React.FC<DesignProps> = (props) => {
  const subLineHeight = 175;
  const bodyLineHeight = 105;

  return (
    <TemplateOne {...props}>
      <g transform="translate(2069.07, 737.5)">
        <text className={styles.headline}>Eej!</text>
        <text className={styles.sub} y="150">
          <tspan x="0" dy={subLineHeight}>
            Go VONK yourself!
          </tspan>
        </text>
        <text className={styles.body} y="525">
          <tspan x="0" dy={bodyLineHeight}>
            Maar als je dan toch zo nieuwsgierig
          </tspan>
          <tspan x="0" dy={bodyLineHeight}>
            bent naar wat er achter de
          </tspan>
          <tspan x="0" dy={bodyLineHeight}>
            schermen gebeurt, schrijf je
          </tspan>
          <tspan x="0" dy={bodyLineHeight}>
            dan in voor de VONK Roadshow!
          </tspan>
        </text>
      </g>
    </TemplateOne>
  );
};

export default DesignThree;
