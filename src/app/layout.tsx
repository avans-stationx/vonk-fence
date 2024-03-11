import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AudioPlayer from './components/AudioPlayer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VONK Fence Installation',
  description: 'VONK Fence Installation at Avansdag 2024',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AudioPlayer src="/ambient.mp3" repeat={true} />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
