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
    cookies: userCookies,
  } = req.body || {};

  const browser = new BrowserManager();

  try {
    let executablePath;
    let args = [];
    let headless = true;

    if (process.env.VERCEL) {
      executablePath = await chromium.executablePath();
      args = chromium.args;
      headless = chromium.headless;
    }

    console.log("Launching browser…");
    await browser.launch({
      headless,
      executablePath,
      args,
    });

    /* =========================
       🔑 COOKIE INJECTION FIRST
       ========================= */
    if (Array.isArray(userCookies)) {
      await browser.loadCookies(userCookies);
    }

    /* =========================
       🔐 AUTH VALIDATION
       ========================= */
    await browser.open("https://www.linkedin.com/feed/");
    await browser.waitForLoad();

    const page = browser.getPage();
    const currentUrl = page.url();

    if (currentUrl.includes("login")) {
      throw new Error("Cookies invalid or expired");
    }

    let result;

    switch (action) {
      case "snapshot":
        if (url) {
          await browser.open(url);
          await browser.waitForLoad();
        }
        result = await browser.getSnapshot({ interactive: true });
        break;

      case "linkedin-me":
        result = { authenticated: true };
        break;

      case "linkedin-search": {
        if (!searchTerm) throw new Error("searchTerm is required");
        const visitService = new LinkedInVisitService(browser);
        result = await visitService.searchPeople(searchTerm);
        break;
      }

      case "linkedin-connect": {
        if (!profileUrl) throw new Error("profileUrl is required");
        const connectService = new LinkedInConnectService(browser);
        result = await connectService.sendConnectRequest(profileUrl);
        break;
      }

      case "linkedin-visit": {
        if (!searchTerm) throw new Error("searchTerm is required");
        const visitService = new LinkedInVisitService(browser);
        result = await visitService.visitProfiles(searchTerm, max);
        break;
      }

      case "linkedin-message": {
        if (!profileUrl) throw new Error("profileUrl is required");
        if (!message) throw new Error("message is required");
        const messageService = new LinkedInMessageService(browser);
        result = await messageService.sendMessage(profileUrl, message);
        break;
      }

      case "get-cookies":
        result = await browser.getPage().context().cookies();
        break;

      case "get-storage":
        result = await browser.getPage().evaluate(() => ({
          local: { ...localStorage },
          session: { ...sessionStorage },
        }));
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    await browser.close();

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Browser error:", error.message);

    try {
      await browser.close();
    } catch {}

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
