import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LinkedInAgentService } from './linkedin';

describe('LinkedInAgentService', () => {
  let browserMock: any;
  let service: LinkedInAgentService;

  beforeEach(() => {
    browserMock = {
      getPage: vi.fn().mockReturnValue({
        url: vi.fn().mockReturnValue('https://www.linkedin.com/feed/'),
        goto: vi.fn().mockResolvedValue(null),
        evaluate: vi.fn().mockResolvedValue(null),
      }),
      getSnapshot: vi.fn().mockResolvedValue({ tree: 'button "Connect" [ref=e1]' }),
      getLocator: vi.fn().mockReturnValue({
        click: vi.fn().mockResolvedValue(null),
      }),
    };
    service = new LinkedInAgentService(browserMock as any);
  });

  it('should login successfully if already on feed', async () => {
    const result = await service.login();
    expect(result).toBe(true);
  });

  it('should extract connect buttons from snapshot', async () => {
    const snapshot = { tree: 'link "John Doe" [ref=e0]\nbutton "Connect" [ref=e1]' };
    const buttons = (service as any).extractConnectButtons(snapshot);
    expect(buttons).toHaveLength(1);
    expect(buttons[0].name).toBe('John Doe');
    expect(buttons[0].connectRef).toBe('@e1');
  });

  it('should handle search people navigation', async () => {
    await service.searchPeople('Software Engineer');
    expect(browserMock.getPage().goto).toHaveBeenCalledWith(expect.stringContaining('keywords=Software%20Engineer'));
  });
});
