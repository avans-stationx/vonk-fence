import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import AudioSystemProvider from './components/AudioSystem/AudioSystemProvider';
import BackgroundAudio from './components/AudioSystem/BackgroundAudio';
import EventHandler from './components/EventHandler';
import RandomSoundPlayer from './components/AudioSystem/RandomSoundPlayer';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
});

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
      <body className={robotoCondensed.variable}>
        <AudioSystemProvider>
          {children}
          <BackgroundAudio
            src="/audio/00_Ambient_MONO.wav"
            channel="left"
            play={true}
            loop={true}
          />
          <RandomSoundPlayer
            sounds={[
              '/audio/01_Gluur_MONO.wav',
              '/audio/02_Gluur_MONO.wav',
              '/audio/03_Gluur_MONO.wav',
              '/audio/04_Gluur_MONO.wav',
              '/audio/05_Gluur_MONO.wav',
              '/audio/06_Gluur_MONO.wav',
              '/audio/07_Gluur_MONO.wav',
              '/audio/08_Gluur_MONO.wav',
              '/audio/09_Gluur_MONO.wav',
            ]}
            channel="right"
            intervalMillis={10000}
            interruptGroups={['ralf']}
          />
          <EventHandler />
        </AudioSystemProvider>
      </body>
    </html>
  );
};

export default RootLayout;
