import chromium from "@sparticuz/chromium";
import { BrowserManager } from '../node_modules/agent-browser/dist/browser.js';

export default async function handler(req, res) {
  let browser;
  const results = {
    passed: [],
    failed: [],
    total: 0,
    environment: {
      isVercel: !!process.env.VERCEL || !!process.env.CI,
      platform: process.platform,
      nodeVersion: process.version
    }
  };

  try {
    // Initialize browser
    browser = new BrowserManager();

    const isVercel = !!process.env.VERCEL || !!process.env.CI;
    const launchOptions = {
      headless: true,
    };

    if (isVercel) {
      launchOptions.executablePath = await chromium.executablePath();
      launchOptions.args = [...chromium.args, "--disable-gpu"];
      console.log('[Test] Using Chromium from:', launchOptions.executablePath);
    }

    console.log('[Test] Launching browser...');
    await browser.launch(launchOptions);

    // Test 1: Check if browser is launched
    results.total++;
    if (browser.isLaunched()) {
      results.passed.push('Browser launched successfully');
    } else {
      results.failed.push('Browser failed to launch');
    }

    // Test 2: Navigate to LinkedIn
    results.total++;
    try {
      const page = browser.getPage();
      await page.goto('https://www.linkedin.com/feed/', { timeout: 30000 });
      if (page.url().includes('linkedin.com')) {
        results.passed.push('Navigation to LinkedIn successful');
      } else {
        results.failed.push('Navigation to LinkedIn failed - wrong URL');
      }
    } catch (error) {
      results.failed.push(`Navigation failed: ${error.message}`);
    }

    // Test 3: Get page title
    results.total++;
    try {
      const page = browser.getPage();
      const title = await page.title();
      if (title && title.includes('LinkedIn')) {
        results.passed.push(`Page title contains LinkedIn: "${title}"`);
      } else {
        results.failed.push(`Page title doesn't contain LinkedIn: "${title}"`);
      }
    } catch (error) {
      results.failed.push(`Get title failed: ${error.message}`);
    }

    // Test 4: Check element visibility
    results.total++;
    try {
      const page = browser.getPage();
      const isVisible = await page.locator('body').isVisible();
      if (isVisible) {
        results.passed.push('Body element is visible');
      } else {
        results.failed.push('Body element is not visible');
      }
    } catch (error) {
      results.failed.push(`Element visibility check failed: ${error.message}`);
    }

    // Test 5: Take screenshot
    results.total++;
    try {
      const page = browser.getPage();
      const buffer = await page.screenshot();
      if (buffer && buffer.length > 0) {
        results.passed.push(`Screenshot taken successfully (${buffer.length} bytes)`);
      } else {
        results.failed.push('Screenshot is empty');
      }
    } catch (error) {
      results.failed.push(`Screenshot failed: ${error.message}`);
    }

    // Test 6: Set viewport
    results.total++;
    try {
      await browser.setViewport(1920, 1080);
      const page = browser.getPage();
      const size = page.viewportSize();
      if (size?.width === 1920 && size?.height === 1080) {
        results.passed.push('Viewport set successfully');
      } else {
        results.failed.push(`Viewport size incorrect: ${JSON.stringify(size)}`);
      }
    } catch (error) {
      results.failed.push(`Viewport test failed: ${error.message}`);
    }

    // Test 7: Get snapshot
    results.total++;
    try {
      const { tree, refs } = await browser.getSnapshot();
      if (tree && typeof refs === 'object') {
        results.passed.push('Snapshot generated successfully');
      } else {
        results.failed.push('Snapshot generation failed');
      }
    } catch (error) {
      results.failed.push(`Snapshot failed: ${error.message}`);
    }

    // Clean up
    await browser.close();

    // Return results
    res.status(200).json({
      success: results.failed.length === 0,
      summary: {
        total: results.total,
        passed: results.passed.length,
        failed: results.failed.length
      },
      results
    });

  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      results
    });
  }
}
