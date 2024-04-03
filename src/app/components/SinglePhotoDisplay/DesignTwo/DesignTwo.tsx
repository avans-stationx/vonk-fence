import React from 'react';
import TemplateOne from '../TemplateOne/TemplateOne';
import { DesignProps } from '../design-props';
import styles from './DesignTwo.module.css';

const DesignTwo: React.FC<DesignProps> = (props) => {
  const subLineHeight = 175;
  const bodyLineHeight = 105;

  return (
    <TemplateOne {...props}>
      <g transform="translate(2069.07, 650)">
        <text className={styles.headline}>Hallo!</text>
        <text className={styles.sub} y="150">
          <tspan x="0" dy={subLineHeight}>
            Die schutting staat
          </tspan>
          <tspan x="0" dy={subLineHeight}>
            er niet voor niets!
          </tspan>
        </text>
        <text className={styles.body} y="700">
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

export default DesignTwo;
