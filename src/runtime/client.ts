import Puppeteer from 'puppeteer';

type Trigger = () => Promise<void>;

export async function startClient(port: number): Promise<Trigger> {
  const browser = await Puppeteer.launch({
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
    ],
    env: {
      DISPLAY: ':0',
    },
  });

  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`);
  await page.click('body');

  return () => page.click('body');
}
