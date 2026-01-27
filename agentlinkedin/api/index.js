import chromium from "@sparticuz/chromium";
import { BrowserManager } from "../node_modules/agent-browser/dist/browser.js";
import { LinkedInVisitService } from "../src/services/visit.js";
import { LinkedInConnectService } from "../src/services/connect.js";
import { LinkedInMessageService } from "../src/services/message.js";
import { LinkedInConversationsService } from "../src/services/conversations.js";
import { LinkedInCampaignsService } from "../src/services/campaigns.js";
import { LinkedInLeadsService } from "../src/services/leads.js";
import { getCookies } from "../db.js";

export default async function handler(req, res) {
  // Allow multiple origins for CORS
  const allowedOrigins = [
    'https://frontend-production-50ccc.up.railway.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    userId,
  } = req.body || {};

  const browser = new BrowserManager();

  // Fetch cookies from DB if userId provided but no cookies
  let userCookies = cookies;
  if (!userCookies && userId) {
    console.log(`[API] Fetching cookies for userId: ${userId}`);
    try {
      userCookies = await getCookies(userId);
      if (!userCookies) {
        return res.status(404).json({
          success: false,
          error: `No cookies found for userId: ${userId}. Please authenticate first at POST /auth/linkedin`
        });
      }
      console.log(`[API] Found cookies for userId: ${userId}`);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch cookies: ${err.message}`
      });
    }
  }

  try {
    const isVercel = !!process.env.VERCEL || !!process.env.CI;
    const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
    const isDocker = !!process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

    console.log("[API] Environment:", {
      isVercel,
      isRailway,
      isDocker,
      platform: process.platform,
    });

    const launchOptions = {
      id: "api-handler",
      action: "launch",
      headless: true,
    };

    /* =========================
       🐳 RAILWAY / DOCKER
       ========================= */
    if (isRailway || isDocker) {
      console.log("[API] Configuring for Railway/Docker with system Chromium...");
      launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
      launchOptions.args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ];
      console.log("[API] Using system Chromium:", launchOptions.executablePath);
    }
    /* =========================
       🚀 VERCEL / SERVERLESS
       ========================= */
    else if (isVercel) {
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
    if (Array.isArray(userCookies) && userCookies.length > 0) {
      console.log("[API] Setting cookies:", userCookies.length);
      await page.context().addCookies(userCookies);
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

      case "linkedin-conversations":
        result = await new LinkedInConversationsService(browser).getConversations(max || 50);
        break;

      case "linkedin-profile":
        result = await new LinkedInConversationsService(browser).getMyProfile();
        break;

      case "linkedin-campaigns":
        result = await new LinkedInCampaignsService(browser).getCampaigns();
        break;

      case "linkedin-leads":
        result = await new LinkedInLeadsService(browser, userId).getAllLeads();
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
