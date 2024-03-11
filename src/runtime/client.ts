import Puppeteer from 'puppeteer';

export async function startClient(port: number) {
  const browser = await Puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0,
    },
    args: [
      process.env.NODE_ENV != 'production' ? '' : '--kiosk',
      '--start-maximized',
    ],
  });

  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`);
  await page.click('body');
}
