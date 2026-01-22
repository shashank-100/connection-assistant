import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LinkedInAgentService } from './linkedin';

describe('LinkedInAgentService - Actual Functionality Tests', () => {
  let browserMock: any;
  let service: LinkedInAgentService;

  beforeEach(() => {
    browserMock = {
      getPage: vi.fn().mockReturnValue({
        url: vi.fn().mockReturnValue('https://www.linkedin.com/feed/'),
        goto: vi.fn().mockResolvedValue(null),
        evaluate: vi.fn().mockResolvedValue(null),
      }),
      getSnapshot: vi.fn().mockResolvedValue({
        tree: `link "John Doe" [ref=e0]\nlink "linkedin.com/in/johndoe" [ref=e1]\nbutton "Connect" [ref=e2]`
      }),
      getLocator: vi.fn().mockReturnValue({
        click: vi.fn().mockResolvedValue(null),
        fill: vi.fn().mockResolvedValue(null),
      }),
    };
    service = new LinkedInAgentService(browserMock as any);
  });

  describe('Authentication', () => {
    it('should return true if user is on feed page', async () => {
      browserMock.getPage().url.mockReturnValue('https://www.linkedin.com/feed/');
      const result = await service.login();
      expect(result).toBe(true);
    });

    it('should return true if user is on my network page', async () => {
      browserMock.getPage().url.mockReturnValue('https://www.linkedin.com/mynetwork/invite-connect/connections/');
      const result = await service.login();
      expect(result).toBe(true);
    });

    it('should return false if user is not on authenticated page', async () => {
      browserMock.getPage().url.mockReturnValue('https://www.linkedin.com/login');
      const result = await service.login();
      expect(result).toBe(false);
    });
  });

  describe('Profile Search', () => {
    it('should navigate to search page with correct keywords', async () => {
      await service.searchPeople('Software Engineer');

      expect(browserMock.getPage().goto).toHaveBeenCalledWith(
        'https://www.linkedin.com/search/results/people/?keywords=Software%20Engineer'
      );
    });

    it('should handle special characters in search terms', async () => {
      await service.searchPeople('C++ Developer');

      expect(browserMock.getPage().goto).toHaveBeenCalledWith(
        expect.stringContaining('C%2B%2B%20Developer')
      );
    });

    it('should scroll to load more results', async () => {
      await service.searchPeople('Manager');

      expect(browserMock.getPage().evaluate).toHaveBeenCalledTimes(3);
      expect(browserMock.getPage().evaluate).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should extract multiple connect buttons from results', async () => {
      browserMock.getSnapshot.mockResolvedValue({
        tree: `link "Alice Smith" [ref=e0]\nbutton "Connect" [ref=e1]
link "Bob Johnson" [ref=e2]\nbutton "Connect" [ref=e3]
link "Charlie Brown" [ref=e4]\nbutton "Connect" [ref=e5]`
      });

      const results = await service.searchPeople('Developer');
      expect(results).toHaveLength(3);
      expect(results[0].name).toBe('Alice Smith');
      expect(results[1].name).toBe('Bob Johnson');
      expect(results[2].name).toBe('Charlie Brown');
    });

    it('should filter out LinkedIn internal links', async () => {
      browserMock.getSnapshot.mockResolvedValue({
        tree: `link "LinkedIn Member" [ref=e0]\nbutton "Connect" [ref=e1]
link "John Doe" [ref=e2]\nbutton "Connect" [ref=e3]`
      });

      const results = await service.searchPeople('Any');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('John Doe');
    });
  });

  describe('Connection Requests', () => {
    it('should click connect button successfully', async () => {
      const result = await service.sendConnectRequest('@e2');

      expect(browserMock.getLocator).toHaveBeenCalledWith('@e2');
      expect(result).toEqual({ success: true });
    });

    it('should handle "Send now" button in modal', async () => {
      browserMock.getSnapshot.mockResolvedValueOnce({
        tree: `textbox "Add a note" [ref=e10]
button "Send now" [ref=e11]
button "Send without a note" [ref=e12]`
      });

      await service.sendConnectRequest('@e2');

      expect(browserMock.getLocator).toHaveBeenCalledWith('@e11');
    });

    it('should handle "Send without a note" button', async () => {
      browserMock.getSnapshot.mockResolvedValueOnce({
        tree: `button "Send without a note" [ref=e12]`
      });

      await service.sendConnectRequest('@e2');

      expect(browserMock.getLocator).toHaveBeenCalledWith('@e12');
    });

    it('should return success even if no note required', async () => {
      browserMock.getSnapshot.mockResolvedValueOnce({
        tree: `heading "Connection sent" [ref=h1]`
      });

      const result = await service.sendConnectRequest('@e2');
      expect(result.success).toBe(true);
    });
  });

  describe('Snapshot Parsing', () => {
    it('should correctly extract person and button association', () => {
      const snapshot = {
        tree: `link "Jane Doe" [ref=e0]
text "Software Engineer at Google" [ref=t1]
button "Connect" [ref=e2]`
      };

      const buttons = (service as any).extractConnectButtons(snapshot);

      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toEqual({
        name: 'Jane Doe',
        connectRef: '@e2'
      });
    });

    it('should handle complex profile names with spaces', () => {
      const snapshot = {
        tree: `link "Dr. Sarah Johnson-Smith" [ref=e0]
button "Connect" [ref=e1]`
      };

      const buttons = (service as any).extractConnectButtons(snapshot);

      expect(buttons[0].name).toBe('Dr. Sarah Johnson-Smith');
    });

    it('should ignore non-connect buttons', () => {
      const snapshot = {
        tree: `link "John Doe" [ref=e0]
button "Message" [ref=e1]
button "More" [ref=e2]
button "Connect" [ref=e3]`
      };

      const buttons = (service as any).extractConnectButtons(snapshot);

      expect(buttons).toHaveLength(1);
      expect(buttons[0].connectRef).toBe('@e3');
    });

    it('should handle multiple people with correct button matching', () => {
      const snapshot = {
        tree: `link "Person One" [ref=e0]
button "Connect" [ref=e1]
link "Person Two" [ref=e2]
button "Connect" [ref=e3]
link "Person Three" [ref=e4]
button "Connect" [ref=e5]`
      };

      const buttons = (service as any).extractConnectButtons(snapshot);

      expect(buttons[0].name).toBe('Person One');
      expect(buttons[0].connectRef).toBe('@e1');
      expect(buttons[1].name).toBe('Person Two');
      expect(buttons[1].connectRef).toBe('@e3');
      expect(buttons[2].name).toBe('Person Three');
      expect(buttons[2].connectRef).toBe('@e5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search results', async () => {
      browserMock.getSnapshot.mockResolvedValue({
        tree: `heading "No results found" [ref=h0]`
      });

      const results = await service.searchPeople('NonExistentPerson');
      expect(results).toHaveLength(0);
    });

    it('should handle network errors gracefully', async () => {
      browserMock.getPage().goto.mockRejectedValue(new Error('Network error'));

      await expect(service.searchPeople('Developer')).rejects.toThrow('Network error');
    });

    it('should handle snapshot parsing errors', async () => {
      browserMock.getSnapshot.mockResolvedValue({
        tree: null as any
      });

      const results = await service.searchPeople('Developer');
      expect(results).toHaveLength(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should respect wait times between actions', async () => {
      const startTime = Date.now();

      await service.searchPeople('Developer');
      await service.sendConnectRequest('@e1');

      const duration = Date.now() - startTime;
      // Should have waited at least 5s for search + 2s for connect
      expect(duration).toBeGreaterThanOrEqual(7000);
    });
  });

  describe('Integration Scenarios', () => {
    it('should complete full search and connect workflow', async () => {
      // Search for people
      browserMock.getSnapshot.mockResolvedValueOnce({
        tree: `link "Alice" [ref=e0]\nbutton "Connect" [ref=e1]`
      });

      const results = await service.searchPeople('Engineer');
      expect(results).toHaveLength(1);

      // Send connect request
      const connectResult = await service.sendConnectRequest(results[0].connectRef);
      expect(connectResult.success).toBe(true);
    });

    it('should handle batch connection requests', async () => {
      browserMock.getSnapshot.mockResolvedValueOnce({
        tree: `link "Person 1" [ref=e0]\nbutton "Connect" [ref=e1]
link "Person 2" [ref=e2]\nbutton "Connect" [ref=e3]
link "Person 3" [ref=e4]\nbutton "Connect" [ref=e5]`
      });

      const people = await service.searchPeople('Developer');

      const results = [];
      for (const person of people) {
        const result = await service.sendConnectRequest(person.connectRef);
        results.push(result);
      }

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });
  });
});

describe('LinkedIn Data Extraction Helpers', () => {
  describe('Profile URL Extraction', () => {
    it('should extract LinkedIn profile URLs from snapshot', () => {
      const snapshot = {
        tree: `link "John Doe" [ref=e0]\nlink "https://www.linkedin.com/in/johndoe" [ref=e1]`
      };

      const urlMatch = snapshot.tree.match(/linkedin\.com\/in\/([^\s\]"]+)/);
      expect(urlMatch).toBeTruthy();
      expect(urlMatch![1]).toBe('johndoe');
    });

    it('should construct full profile URLs', () => {
      const username = 'johndoe';
      const fullUrl = `https://www.linkedin.com/in/${username}`;
      expect(fullUrl).toBe('https://www.linkedin.com/in/johndoe');
    });
  });

  describe('Name Extraction', () => {
    it('should extract names from heading elements', () => {
      const snapshot = `heading "John Smith" [level=1] [ref=h0]`;
      const match = snapshot.match(/heading "([^"]+)"/);
      expect(match).toBeTruthy();
      expect(match![1]).toBe('John Smith');
    });

    it('should handle names with titles', () => {
      const snapshot = `heading "Dr. Jane Doe, PhD" [level=1]`;
      const match = snapshot.match(/heading "([^"]+)"/);
      expect(match![1]).toBe('Dr. Jane Doe, PhD');
    });
  });

  describe('Message Personalization', () => {
    it('should replace name placeholder', () => {
      const template = 'Hi {name}, how are you?';
      const person = { name: 'John Doe' };
      const personalized = template.replace(/{name}/g, person.name.split(' ')[0]);
      expect(personalized).toBe('Hi John, how are you?');
    });

    it('should replace company placeholder from headline', () => {
      const template = 'I see you work at {company}';
      const person = { headline: 'Software Engineer at Google' };
      const companyMatch = person.headline.match(/at (.+?)(?:\s*\||$)/);
      const company = companyMatch ? companyMatch[1] : '';
      const personalized = template.replace(/{company}/g, company);
      expect(personalized).toBe('I see you work at Google');
    });

    it('should replace headline placeholder', () => {
      const template = 'Great profile as a {headline}';
      const person = { headline: 'Full Stack Developer' };
      const personalized = template.replace(/{headline}/g, person.headline);
      expect(personalized).toBe('Great profile as a Full Stack Developer');
    });

    it('should handle multiple placeholders in one message', () => {
      const template = 'Hi {name}! Love your work at {company}. As a {headline}, you must be busy!';
      const person = {
        name: 'Sarah Johnson',
        headline: 'Product Manager at Microsoft'
      };

      let message = template;
      message = message.replace(/{name}/g, person.name.split(' ')[0]);
      const companyMatch = person.headline.match(/at (.+?)(?:\s*\||$)/);
      const company = companyMatch ? companyMatch[1] : '';
      message = message.replace(/{company}/g, company);

      expect(message).toBe('Hi Sarah! Love your work at Microsoft. As a Product Manager at Microsoft, you must be busy!');
    });
  });

  describe('Connection Filtering', () => {
    it('should filter connections by headline term', () => {
      const connections = [
        { name: 'Alice', headline: 'Software Engineer at Google', profileUrl: 'url1' },
        { name: 'Bob', headline: 'Product Manager at Facebook', profileUrl: 'url2' },
        { name: 'Charlie', headline: 'Data Scientist at Google', profileUrl: 'url3' },
      ];

      const filtered = connections.filter(c =>
        c.headline.toLowerCase().includes('google') ||
        c.name.toLowerCase().includes('google')
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.map(c => c.name)).toEqual(['Alice', 'Charlie']);
    });

    it('should filter connections by name term', () => {
      const connections = [
        { name: 'Alice Johnson', headline: 'Engineer', profileUrl: 'url1' },
        { name: 'Bob Smith', headline: 'Manager', profileUrl: 'url2' },
        { name: 'Alice Williams', headline: 'Designer', profileUrl: 'url3' },
      ];

      const filtered = connections.filter(c =>
        c.name.toLowerCase().includes('alice')
      );

      expect(filtered).toHaveLength(2);
    });
  });
});
