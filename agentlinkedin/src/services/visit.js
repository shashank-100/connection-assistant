import { BaseLinkedInService } from "./base.js";

export class LinkedInVisitService extends BaseLinkedInService {
  async searchPeople(searchTerm) {
    console.log('[LinkedInVisitService] Searching for:', searchTerm);
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
    const page = this.browser.getPage();

    try {
      await page.goto(searchUrl, { waitUntil: "load", timeout: 45000 });
      console.log('[LinkedInVisitService] Search page loaded');
      await this.wait(2000);

      // Scroll to load more results (reduced for Vercel timeout)
      for (let i = 0; i < 2; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.wait(1500);
      }

      const snapshot = await this.browser.getSnapshot({ interactive: true });
      const people = [];

      Object.keys(snapshot.refs).forEach(id => {
        const el = snapshot.refs[id];
        if (el.role === 'link' && el.name && !el.name.includes('LinkedIn')) {
          if (el.selector?.includes('reusable-search__result-container')) {
             people.push({
               name: el.name,
               profileUrl: el.href,
               ref: `@${id}`
             });
          }
        }
      });

      console.log('[LinkedInVisitService] Found people:', people.length);
      return people;
    } catch (error) {
      console.error('[LinkedInVisitService] Search error:', error.message);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async visitProfiles(searchTerm, max) {
    console.log('[LinkedInVisitService] Visiting profiles, max:', max);
    const people = await this.searchPeople(searchTerm);
    const visited = [];
    const errors = [];

    const visitLimit = Math.min(people.length, max);
    const page = this.browser.getPage();

    for (let i = 0; i < visitLimit; i++) {
      const person = people[i];
      if (person.profileUrl) {
        try {
          console.log(`[LinkedInVisitService] Visiting ${i + 1}/${visitLimit}:`, person.name);
          await page.goto(person.profileUrl, { waitUntil: "load", timeout: 30000 });
          await this.wait(2000);
          visited.push({
            url: person.profileUrl,
            name: person.name
          });
        } catch (error) {
          console.error(`[LinkedInVisitService] Failed to visit ${person.name}:`, error.message);
          errors.push({
            url: person.profileUrl,
            name: person.name,
            error: error.message
          });
        }
      }
    }

    console.log('[LinkedInVisitService] Visit complete. Success:', visited.length, 'Errors:', errors.length);

    return {
      success: true,
      visited,
      errors,
      message: `Visited ${visited.length} of ${visitLimit} profiles.`,
    };
  }
}
