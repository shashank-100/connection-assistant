import chromium from '@sparticuz/chromium-min';
import { BrowserManager } from '../agent-browser/browser';

export async function launchServerlessBrowser() {
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

  const browser = new BrowserManager();

  const executablePath = isVercel
    ? await chromium.executablePath(
        'https://github.com/sparticuz/chromium/releases/download/v132.0.0/chromium-v132.0.0-pack.tar'
      )
    : undefined;

  await browser.launch({
    id: 'serverless',
    action: 'launch',
    executablePath,
    headless: true,
    viewport: { width: 1280, height: 720 },
  });

  return browser;
}
