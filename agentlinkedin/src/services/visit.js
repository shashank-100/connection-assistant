import { BaseLinkedInService } from "./base.js";

export class LinkedInVisitService extends BaseLinkedInService {
  async searchPeople(searchTerm) {
    const page = await this.getPage();
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle" });
    await this.wait(3000);

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.wait(2000);
    }

    const results = await page.evaluate(() => {
      const people = [];
      const resultItems = document.querySelectorAll(
        "li.reusable-search__result-container",
      );

      resultItems.forEach((item) => {
        const nameElement = item.querySelector('span[aria-hidden="true"]');
        const linkElement = item.querySelector("a.app-aware-link");
        const buttonElement = item.querySelector(
          ".reusable-search__result-card .artdeco-button",
        );

        if (nameElement && linkElement && buttonElement) {
          const name = nameElement.textContent?.trim();
          const profileUrl = linkElement.getAttribute("href");
          const actionText = buttonElement.textContent?.trim();

          if (
            name &&
            profileUrl &&
            actionText?.toLowerCase().includes("connect")
          ) {
            people.push({
              name,
              profileUrl,
              action: actionText,
            });
          }
        }
      });
      return people;
    });

    return results;
  }

  async visitProfiles(searchTerm, max) {
    const people = await this.searchPeople(searchTerm);
    const visited = [];

    const visitLimit = Math.min(people.length, max);
    for (let i = 0; i < visitLimit; i++) {
      const person = people[i];
      if (person.profileUrl) {
        const page = await this.getPage();
        await page.goto(person.profileUrl, { waitUntil: "networkidle" });
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
