import chromium from "@sparticuz/chromium";
import { BrowserManager } from "../node_modules/agent-browser/dist/browser.js";
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

    console.log("[API] Environment:", {
      isVercel,
      platform: process.platform,
    });

    const launchOptions = {
      id: "api-handler",
      action: "launch",
      headless: true,
    };

    /* =========================
       🚀 VERCEL / SERVERLESS
       ========================= */
    if (isVercel) {
      console.log("[API] Configuring Chromium for Vercel...");

      const executablePath = await chromium.executablePath();

      launchOptions.executablePath = executablePath;
      // Use minimal proven-working args (NOT chromium.args which includes --single-process)
      launchOptions.args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-features=site-per-process',
      ];

      console.log("[API] Chromium executable path:", executablePath);
      console.log("[API] Using minimal serverless args (avoiding --single-process)");
    }

    console.log(
      "[API] Launching browser with options:",
      JSON.stringify(launchOptions, null, 2)
    );

    await browser.launch(launchOptions);

    console.log("[API] Browser launched successfully");
    console.log("[API] Browser isLaunched:", browser.isLaunched());

    browser.startRequestTracking();
    console.log("[API] Request tracking started");

    const page = browser.getPage();

    /* =========================
       🍪 COOKIES
       ========================= */
    if (Array.isArray(cookies) && cookies.length > 0) {
      console.log("[API] Setting cookies:", cookies.length);
      await page.context().addCookies(cookies);
    }

    /* =========================
       🔐 AUTH CHECK
       ========================= */
    console.log("[API] Navigating to LinkedIn feed...");
    await page.goto("https://www.linkedin.com/feed/", {
      waitUntil: "load",
      timeout: 45000,
    });

    const currentUrl = page.url();
    console.log("[API] Current URL:", currentUrl);

    if (
      currentUrl.includes("login") ||
      currentUrl.includes("authwall")
    ) {
      throw new Error(
        "LinkedIn auth failed — cookies expired or missing"
      );
    }

    /* =========================
       ⚙️ ACTIONS
       ========================= */
    let result;

    console.log("[API] Executing action:", action);

    switch (action) {
      case "snapshot":
        if (url) {
          console.log("[API] Opening URL:", url);
          await page.goto(url, {
            waitUntil: "load",
            timeout: 45000,
          });
        }
        result = await browser.getSnapshot({ interactive: true });
        break;

      case "linkedin-me":
        result = {
          authenticated: true,
          url: currentUrl,
          timestamp: new Date().toISOString(),
        };
        break;

      case "linkedin-search":
        if (!searchTerm) throw new Error("searchTerm required");
        result = await new LinkedInVisitService(browser).searchPeople(
          searchTerm
        );
        break;

      case "linkedin-connect":
        if (!profileUrl) throw new Error("profileUrl required");
        result =
          await new LinkedInConnectService(
            browser
          ).sendConnectRequest(profileUrl);
        break;

      case "linkedin-visit":
        if (!searchTerm) throw new Error("searchTerm required");
        result = await new LinkedInVisitService(browser).visitProfiles(
          searchTerm,
          max
        );
        break;

      case "linkedin-message":
        if (!profileUrl || !message) {
          throw new Error("profileUrl & message required");
        }
        result =
          await new LinkedInMessageService(browser).sendMessage(
            profileUrl,
            message
          );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log("[API] Closing browser...");
    await browser.close();
    console.log("[API] Browser closed");

    return res.status(200).json({
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[API] Error:", err.message);
    console.error(err.stack);

    try {
      await browser.close();
    } catch (_) {}

    return res.status(500).json({
      success: false,
      error: err.message,
      action,
      timestamp: new Date().toISOString(),
    });
  }
}
