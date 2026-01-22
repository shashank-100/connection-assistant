import { BaseLinkedInService } from "./base.js";

export class LinkedInVisitService extends BaseLinkedInService {
  async searchPeople(searchTerm) {
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
    await this.browser.getPage().goto(searchUrl, { waitUntil: "networkidle" });
    await this.wait(3000);

    for (let i = 0; i < 3; i++) {
      await this.browser.getPage().evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.wait(2000);
    }

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    const people = [];
    
    Object.keys(snapshot.refs).forEach(id => {
      const el = snapshot.refs[id];
      if (el.role === 'link' && el.name && !el.name.includes('LinkedIn')) {
        if (el.selector.includes('reusable-search__result-container')) {
           people.push({
             name: el.name,
             profileUrl: el.href,
             ref: `@${id}`
           });
        }
      }
    });

    return people;
  }

  async visitProfiles(searchTerm, max) {
    const people = await this.searchPeople(searchTerm);
    const visited = [];

    const visitLimit = Math.min(people.length, max);
    for (let i = 0; i < visitLimit; i++) {
      const person = people[i];
      if (person.profileUrl) {
        await this.browser.getPage().goto(person.profileUrl, { waitUntil: "networkidle" });
        await this.wait(3000);
        visited.push(person.profileUrl);
      }
    }

    return {
      success: true,
      visited,
      message: `Visited ${visited.length} profiles.`,
    };
  }
}
