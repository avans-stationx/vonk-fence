import React from 'react';
import styles from './TemplateOne.module.css';

type TemplateOneProps = {
  children?: React.ReactNode;
  photo: string;
  serialNumber: number;
};

const TemplateOne: React.FC<TemplateOneProps> = ({
  children,
  photo,
  serialNumber,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2250">
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="597.44"
          y1="10.26"
          x2="3583.06"
          y2="2425.15"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#d9443b" />
          <stop offset=".53" stopColor="#e4552b" />
          <stop offset=".93" stopColor="#ef651e" />
        </linearGradient>
        <clipPath id="photo-circle">
          <circle r="750" cx="750" cy="750" />
        </clipPath>
      </defs>
      <rect className={styles.background} width="3840" height="2250" />
      <image
        className={styles.photo}
        width="1500"
        height="1500"
        href={photo}
        clipPath="url(#photo-circle)"
      />
      <text className={styles.serial} x="880" y="1975">
        #{serialNumber.toString().padStart(5, '0')}
      </text>
      <g className={styles.flame}>
        <path d="M330.16,1395.28c-15.55-1.11-36.24,56.26-35.75,69.95.63,17.61,12.56,45.91,28.49,53.64,4.28-6.17-1.21-13.36,4.4-18.11.77-17.4,17.49-30.75,18.77-49.42,1.34-19.65-8.22-38.63-15.9-56.05Z" />
        <path d="M660.45,1347.11c-7.23,6.62-17.8,10.29-22.75,19.57,1.06,2.4,1.88,4.26,2.92,6.63h8.71c6.56-5.42,13.46-11.12,19.83-16.38.5-6.73-1.58-10.21-8.71-9.82Z" />
        <path d="M628.57,1448.11c6.73,7.04,22.36,13.5,32.73,13.45,1.05-2.65,2.25-5.69,3.3-8.33-7.97-8.79-19.53-6.99-26.84-12.99-3.51,3.01-6.36,5.45-9.18,7.87Z" />
        <path d="M554.87,1348.75c3.33,4.61,7.62,3.97,12.41,3.23v-30.28q-5.52-4.83-12.41-.64v27.68Z" />
        <path d="M512.42,1690.88h10.53c-4.36-15.56-22.31-27.73-30.89-41.34-10.15-16.1-10.63-31.14-15.88-48.51h-9.46c-4.24,34.15,22.6,67.66,45.7,89.84Z" />
        <path d="M554.82,1746.78c-3.09-3.8-6.01-6.18-10.68-3.7-1.11,29.48-12.54,63.07-45.99,66.41-.98,2.56-2.13,5.59-3.23,8.48,36.11,20.35,57.42-50.06,59.9-71.19Z" />
        <path d="M278.6,1672.69c.75-2.19,1.5-4.41,2.06-6.06q10.71,5.87,17.44,4.83c0-48.92,7.26-90.09,27.74-134.76,13.06-.93,21.36,43.74,33.67,51.75,0-47.13,13.19-70.6,40.19-108.65,21.65-30.49,64.54-88.27,37.86-128.81,1.47-2.78,2.54-4.86,3.63-6.97,86.3,35.03,186.61,100.8,147.95,211.26,1.95,13.14-5.13,25.69-2.22,39.22l3.44,3.44c5.1-5.71,32.2-41.36,38.5-39.22,6.52,21.44,17.62,41.15,20.72,63.68,2.32,17.01-6.52,38.74-.29,54.18,5.71-3.52,10.63-6.57,15.59-9.64,1.52,1.71,2.7,3.04,4.49,5.05,2.58,18.97,2.14,35.19,1.01,47.24-.37,3.95-2.15,21.8-9.16,44.53-4.28,13.89-7.92,25.7-16.45,39.44-9.51,15.33-20.61,25.83-28.94,32.49-16.69,12.63-65.39,46.06-136.18,48.06-78.9,2.22-133.67-36.07-149.53-48.06-42.19-50.71-53.4-98.66-53.4-164.56.61.53,1.25,1.04,1.87,1.55ZM466.31,1393.58c0,35.01-2.43,58.74-26.83,85.95-9.27,10.31-19.84,18.53-27.5,30.28-8.2,12.58-10.04,28.76-18.53,40.51,2.99,2.54,5.85,4.97,9.08,7.74,9.43-5.95,11.13-24.99,16.39-34.87,8.62-16.15,21.49-24.62,33.24-37.92,24.75-27.98,27.5-55.54,27.5-91.26q-6.25-5.13-13.35-.43ZM474.32,1846.38c6.4.36,18.86.53,33.94-3.05,4.88-1.16,12.78-3.08,22.13-7.63,16.88-8.23,27.4-19.65,32.04-25.29,13.93-16.9,18.04-34.06,20.19-42.48,7.53-29.56,5.71-73.22-17.12-96.04-3.07,1.42-5.69,2.62-7.93,3.69-.67,15.57-.88,16.21-7.9,23.87-1.58-24.75-13.16-39.7-27.61-57.43-18-22.08-21.04-44.3-21.04-72.01-31.48-15.54-90.86,40.72-93.45,70.25-10.47,14.71-3.87,42.51,0,58.32-1.07.56-3.02,1.6-5.07,2.7-4.33-4.38-9.67-9.75-15.46-15.57-4.89,2.72-9.85,5.26-8.84,12.44-11.32,16.68-13.94,31.23-14.59,39.71-3.54,45.66,36.61,83.35,67.99,97.85,19.99,9.24,39.51,10.5,42.72,10.68Z" />
      </g>
      <g className={styles.text}>{children}</g>
    </svg>
  );
};

export default TemplateOne;
