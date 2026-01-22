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

  async sendConnectRequest(profileUrl) {
    await this.browser.getPage().goto(profileUrl, { waitUntil: 'load' });
    await this.wait(3000);

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    const connectButtonRef = Object.keys(snapshot.refs).find(id => {
      const el = snapshot.refs[id];
      return el.role === 'button' && (el.name === 'Connect' || el.name?.includes('Connect'));
    });

    if (connectButtonRef) {
      await this.browser.getLocator(`@${connectButtonRef}`).click();
    } else {
      const moreButtonRef = Object.keys(snapshot.refs).find(id => {
        const el = snapshot.refs[id];
        return el.role === 'button' && (el.name === 'More' || el.name === 'More actions');
      });
      if (moreButtonRef) {
        await this.browser.getLocator(`@${moreButtonRef}`).click();
        await this.wait(2000);
        
        const dropdownSnapshot = await this.browser.getSnapshot({ interactive: true });
        const dropdownConnectRef = Object.keys(dropdownSnapshot.refs).find(id => {
          const el = dropdownSnapshot.refs[id];
          return el.name?.includes('Connect');
        });
        if (dropdownConnectRef) {
          await this.browser.getLocator(`@${dropdownConnectRef}`).click();
        } else {
          throw new Error('Could not find Connect button in "More" dropdown.');
        }
      } else {
        throw new Error('Could not find "Connect" or "More" button.');
      }
    }
    
    await this.wait(2000);

    const modalSnapshot = await this.browser.getSnapshot({ interactive: true });
    const sendButtonRef = Object.keys(modalSnapshot.refs).find(id => {
      const el = modalSnapshot.refs[id];
      return el.role === 'button' && (el.name === 'Send without a note' || el.name === 'Send now');
    });

    if (sendButtonRef) {
      await this.browser.getLocator(`@${sendButtonRef}`).click();
    }
    
    return { success: true };
  }

  async visitProfiles(searchTerm, max) {
    const people = await this.searchPeople(searchTerm);
    const visited = [];

    const visitLimit = Math.min(people.length, max);
    for (let i = 0; i < visitLimit; i++) {
      const person = people[i];
      if (person.selector) {
        await this.browser.getPage().goto(person.selector, { waitUntil: 'load' });
        await this.wait(3000);
        visited.push(person.selector);
      }
    }

    return { success: true, visited, message: `Visited ${visited.length} profiles.` };
  }
}
