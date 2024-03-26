import Puppeteer, { KeyInput, PuppeteerLaunchOptions } from 'puppeteer-core';

type Trigger = (key: KeyInput) => Promise<void>;

export async function startClient(port: number): Promise<Trigger> {
  const globalOptions: PuppeteerLaunchOptions = {
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0,
    },
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      process.env.NODE_ENV != 'production' ? '' : '--kiosk',
      '--start-maximized',
      '--autoplay-policy=no-user-gesture-required',
    ],
  };

  const remoteEnv: PuppeteerLaunchOptions = {
    env: {
      DISPLAY: ':0',
    },
  };

  const browser = await Puppeteer.launch({
    ...globalOptions,
    ...(process.env.RUN_LOCATION == 'remote' ? remoteEnv : {}),
  });

  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`);

  await page.focus('body');
  await page.keyboard.up('a');

  return (key) => page.keyboard.up(key);
}
