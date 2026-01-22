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
    url,
    action = "snapshot",
    searchTerm,
    max = 5,
    profileUrl,
    message,
    cookies: userCookies,
  } = req.body;

  const browser = new BrowserManager();

  try {
    let executablePath;
    if (process.env.VERCEL) {
      executablePath = await chromium.executablePath();
    }

    await browser.launch({
      headless: !!chromium.headless,
      executablePath,
      args: chromium.args,
    });

    const page = browser.getPage();
    browser.startRequestTracking();

    if (userCookies && Array.isArray(userCookies)) {
      await page.context().addCookies(userCookies);
    }

    let result;

    switch (action) {
      case "snapshot":
        if (url) await page.goto(url, { waitUntil: "load" });
        result = await browser.getSnapshot({ interactive: true });
        break;
      case "click":
        const locator = browser.getLocator(req.body.selector);
        await locator.click();
        result = { success: true, action: "click", selector: req.body.selector };
        break;
      case "fill":
        const fillLocator = browser.getLocator(req.body.selector);
        await fillLocator.fill(req.body.text);
        result = { success: true, action: "fill", text: req.body.text };
        break;
      case "linkedin-me":
        await page.goto("https://www.linkedin.com/feed/", { waitUntil: "domcontentloaded" });
        if (page.url().includes("login")) {
          result = { authenticated: false };
        } else {
          const snapshot = await browser.getSnapshot({ interactive: true });
          result = { authenticated: true, snapshot };
        }
        break;
      case "linkedin-search":
        if (!searchTerm) throw new Error("searchTerm is required");
        const visitService = new LinkedInVisitService(browser);
        result = await visitService.searchPeople(searchTerm);
        break;
      case "linkedin-connect":
        if (!profileUrl) throw new Error("profileUrl is required");
        const connectService = new LinkedInConnectService(browser);
        result = await connectService.sendConnectRequest(profileUrl);
        break;
      case "linkedin-visit":
        if (!searchTerm) throw new Error("searchTerm is required");
        const visitService2 = new LinkedInVisitService(browser);
        result = await visitService2.visitProfiles(searchTerm, max);
        break;
      case "linkedin-message":
        if (!profileUrl) throw new Error("profileUrl is required");
        if (!message) throw new Error("message is required");
        const messageService = new LinkedInMessageService(browser);
        result = await messageService.sendMessage(profileUrl, message);
        break;
      case "get-cookies":
        const pageCookies = browser.getPage();
        result = await pageCookies.context().cookies();
        break;
      case "get-storage":
        result = await browser.getPage().evaluate(() => ({
          local: { ...localStorage },
          session: { ...sessionStorage },
        }));
        break;
      case "get-network":
        result = browser.getRequests(searchTerm);
        break;
      case "clear-network":
        browser.clearRequests();
        result = { message: "Network logs cleared" };
        break;
      default:
        if (url) {
          await browser.getPage().goto(url, { waitUntil: "load" });
          result = { message: "Navigation successful to " + url };
        } else {
          result = { message: "No action performed" };
        }
    }

    await browser.close();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Browser error:", error);
    try {
      await browser.close();
    } catch (e) {
      console.error("Error closing browser:", e);
    }
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
