export class BaseLinkedInService {
  constructor(browser) {
    this.browser = browser;
  }

  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getPage() {
    return this.browser.getPage();
  }
}
