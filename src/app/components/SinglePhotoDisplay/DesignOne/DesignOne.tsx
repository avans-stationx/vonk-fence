import React from 'react';
import TemplateOne from '../TemplateOne/TemplateOne';
import { DesignProps } from '../design-props';
import styles from './DesignOne.module.css';

const DesignOne: React.FC<DesignProps> = (props) => {
  const lineHeight = 250;

  return (
    <TemplateOne {...props}>
      <g transform="translate(2069.07, 500)">
        <text className={styles.headline}>Attentie!</text>
        <text className={styles.body} y="150">
          <tspan x="0" dy={lineHeight}>
            Wil de eigenaar
          </tspan>
          <tspan x="0" dy={lineHeight}>
            van dit oog zich
          </tspan>
          <tspan x="0" dy={lineHeight}>
            melden bij VONK
          </tspan>
          <tspan x="0" dy={lineHeight}>
            en zich inschrijven{' '}
          </tspan>
          <tspan x="0" dy={lineHeight}>
            voor de roadshow?
          </tspan>
        </text>
      </g>
    </TemplateOne>
  );
};

export default DesignOne;
