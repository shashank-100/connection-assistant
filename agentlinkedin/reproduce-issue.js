import { chromium } from 'playwright';
import sparticuzChromium from '@sparticuz/chromium';

async function reproduce() {
  console.log('--- Starting Reproduction of Vercel Launch ---');
  
  try {
    const executablePath = await sparticuzChromium.executablePath();
    console.log('Executable Path:', executablePath);

    const args = [
      '--disable-field-trial-config',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-back-forward-cache',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-extensions-with-background-pages',
      '--disable-component-update',
      '--no-default-browser-check',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-features=AcceptCHFrame,AvoidUnnecessaryBeforeUnloadCheckSync,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints',
      '--enable-features=CDPScreenshotNewSurface',
      '--allow-pre-commit-input',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--force-color-profile=srgb',
      '--metrics-recording-only',
      '--no-first-run',
      '--password-store=basic',
      '--use-mock-keychain',
      '--no-service-autorun',
      '--export-tagged-pdf',
      '--disable-search-engine-choice-screen',
      '--unsafely-disable-devtools-self-xss-warnings',
      '--edge-skip-compat-layer-relaunch',
      '--enable-automation',
      '--disable-infobars',
      '--disable-search-engine-choice-screen',
      '--disable-sync',
      '--headless',
      '--hide-scrollbars',
      '--mute-audio',
      '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
      '--no-sandbox',
      '--no-startup-window'
    ];

    console.log('Launching browser with identical Vercel flags...');
    const browser = await chromium.launch({
      executablePath,
      args,
      headless: true
    });

    console.log('Browser launched successfully!');
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('Page title:', await page.title());
    
    await browser.close();
    console.log('--- Test Passed Locally ---');
  } catch (err) {
    console.error('--- Test Failed ---');
    console.error(err);
  }
}

reproduce();
