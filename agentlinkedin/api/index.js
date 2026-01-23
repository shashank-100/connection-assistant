import chromium from "@sparticuz/chromium";
import { BrowserManager } from "agent-browser/dist/browser.js";
import { LinkedInVisitService } from "../src/services/visit.js";
import { LinkedInConnectService } from "../src/services/connect.js";
import { LinkedInMessageService } from "../src/services/message.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    action = "snapshot",
    url,
    searchTerm,
    max = 5,
    profileUrl,
    message,
    cookies,
  } = req.body || {};

  const browser = new BrowserManager();

  try {
    const isVercel = !!process.env.VERCEL || !!process.env.CI;

    console.log('[API] Environment:', { isVercel, platform: process.platform });

    const launchOptions = {
      id: 'api-handler',
      action: 'launch',
      headless: true,
    };

    if (isVercel) {
      launchOptions.executablePath = await chromium.executablePath();
      launchOptions.args = chromium.args;
      console.log('[API] Chromium executable path:', launchOptions.executablePath);
      console.log('[API] Chromium args count:', launchOptions.args.length);
      console.log('[API] Launch options:', JSON.stringify(launchOptions, null, 2));
    }

    console.log('[API] Launching browser with options:', JSON.stringify(launchOptions, null, 2));
    try {
      await browser.launch(launchOptions);
      console.log('[API] Browser.launch() completed successfully');
    } catch (launchError) {
      console.error('[API] Browser.launch() failed:', launchError);
      console.error('[API] Launch error stack:', launchError.stack);
      console.error('[API] Launch error message:', launchError.message);
      throw launchError;
    }

    console.log('[API] Browser launched successfully');
    console.log('[API] Browser isLaunched:', browser.isLaunched());

    browser.startRequestTracking();
    console.log('[API] Request tracking started');

    /* =========================
       🔑 COOKIES (via page context)
       ========================= */
    if (Array.isArray(cookies) && cookies.length > 0) {
      console.log('[API] Setting cookies:', cookies.length);
      const page = browser.getPage();
      await page.context().addCookies(cookies);
    }

    /* =========================
       🔐 AUTH CHECK (agent-browser)
       ========================= */
    const page = browser.getPage();
    console.log('[API] Navigating to LinkedIn feed...');
    await page.goto("https://www.linkedin.com/feed/", {
      waitUntil: 'load',
      timeout: 45000
    });

    const currentUrl = page.url();
    console.log('[API] Current URL after navigation:', currentUrl);

    if (currentUrl?.includes("login") || currentUrl?.includes("authwall")) {
      throw new Error("LinkedIn auth failed — cookies expired or missing");
    }

    let result;

    console.log('[API] Executing action:', action);

    switch (action) {
      case "snapshot":
        if (url) {
          console.log('[API] Opening URL:', url);
          await page.goto(url, { waitUntil: 'load', timeout: 45000 });
        }
        result = await browser.getSnapshot({ interactive: true });
        console.log('[API] Snapshot captured');
        break;

      case "linkedin-me":
        result = {
          authenticated: true,
          url: currentUrl,
          timestamp: new Date().toISOString()
        };
        console.log('[API] Auth check successful');
        break;

      case "linkedin-search":
        if (!searchTerm) throw new Error("searchTerm required");
        console.log('[API] Searching for:', searchTerm);
        result = await new LinkedInVisitService(browser).searchPeople(searchTerm);
        console.log('[API] Search completed, found:', result.length, 'people');
        break;

      case "linkedin-connect":
        if (!profileUrl) throw new Error("profileUrl required");
        console.log('[API] Sending connect request to:', profileUrl);
        result = await new LinkedInConnectService(browser).sendConnectRequest(profileUrl);
        console.log('[API] Connect request result:', result.status);
        break;

      case "linkedin-visit":
        if (!searchTerm) throw new Error("searchTerm required");
        console.log('[API] Visiting profiles for search:', searchTerm, 'max:', max);
        result = await new LinkedInVisitService(browser).visitProfiles(searchTerm, max);
        console.log('[API] Visit completed:', result.visited?.length, 'profiles');
        break;

      case "linkedin-message":
        if (!profileUrl || !message) {
          throw new Error("profileUrl & message required");
        }
        console.log('[API] Sending message to:', profileUrl);
        result = await new LinkedInMessageService(browser).sendMessage(
          profileUrl,
          message
        );
        console.log('[API] Message sent:', result.status);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('[API] Closing browser...');
    await browser.close();
    console.log('[API] Browser closed successfully');

    return res.status(200).json({
      success: true,
      data: result,
      action,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("[API] Error occurred:", err);
    console.error("[API] Error stack:", err.stack);

    try {
      console.log('[API] Attempting to close browser after error...');
      await browser.close();
    } catch (closeErr) {
      console.error('[API] Failed to close browser:', closeErr.message);
    }

    return res.status(500).json({
      success: false,
      error: err.message,
      action,
      timestamp: new Date().toISOString()
    });
  }
}
