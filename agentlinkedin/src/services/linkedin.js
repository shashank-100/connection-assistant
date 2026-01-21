export class LinkedInAgentService {
  constructor(browser) {
    this.browser = browser;
  }

  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login() {
    const page = this.browser.getPage();
    const url = page.url();
    if (url.includes('feed') || url.includes('mynetwork')) {
      return true;
    }
    return false;
  }

  async searchPeople(searchTerm) {
    const page = this.browser.getPage();
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      searchTerm
    )}&origin=GLOBAL_SEARCH_HEADER`;
    
    await page.goto(searchUrl, { waitUntil: "networkidle" });

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    
    const people = [];
    const refs = snapshot.refs;

    for (const refId in refs) {
      const element = refs[refId];
      if (element.role === 'link' && element.name && !element.name.includes('LinkedIn')) {
        people.push({
          name: element.name,
          ref: `@${refId}`,
          selector: element.selector
        });
      }
    }

    return people;
  }


    const results = await page.evaluate(() => {
      const people = [];
      const resultItems = document.querySelectorAll('li.reusable-search__result-container');

      resultItems.forEach(item => {
        const nameElement = item.querySelector('span[aria-hidden="true"]');
        const linkElement = item.querySelector('a.app-aware-link');
        const buttonElement = item.querySelector('.reusable-search__result-card .artdeco-button');
        
        if (nameElement && linkElement && buttonElement) {
          const name = nameElement.textContent?.trim();
          const profileUrl = linkElement.getAttribute('href');
          const actionText = buttonElement.textContent?.trim();

          if (name && profileUrl && actionText?.toLowerCase().includes('connect')) {
            people.push({
              name,
              profileUrl,
              action: actionText
            });
          }
        }
      });
      return people;
    });
    
    return results;
  }

  async sendConnectRequest(profileUrl) {
    const page = this.browser.getPage();
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await this.wait(3000);

    const connectButton = page.locator('button:has-text("Connect")').first();
    if (!connectButton) {
      throw new Error('Could not find "Connect" button on profile page.');
    }
    await connectButton.click();
    
    await this.wait(2000);

    const sendButton = page.locator('button[aria-label="Send now"]');
    if (await sendButton.isVisible()) {
      await sendButton.click();
    }
    
    return { success: true };
  }

  async visitProfiles(searchTerm, max) {
    const people = await this.searchPeople(searchTerm);
    const visited = [];

    const visitLimit = Math.min(people.length, max);
    for (let i = 0; i < visitLimit; i++) {
      const person = people[i];
      if (person.profileUrl) {
        const page = this.browser.getPage();
        await page.goto(person.profileUrl, { waitUntil: 'networkidle' });
        await this.wait(3000);
        visited.push(person.profileUrl);
      }
    }

    return { success: true, visited, message: `Visited ${visited.length} profiles.` };
  }
}
