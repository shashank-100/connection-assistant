import { kv } from '@vercel/kv';

const COOKIE_KEY = 'linkedin:cookies';

export const LinkedInCookieStore = {
  async load() {
    try {
      return await kv.get<any[]>(COOKIE_KEY);
    } catch (error) {
      console.error('Error loading cookies from KV:', error);
      return null;
    }
  },

  async save(cookies: any[]) {
    try {
      await kv.set(COOKIE_KEY, cookies, {
        ex: 604800,
      });
    } catch (error) {
      console.error('Error saving cookies to KV:', error);
    }
  },

  async clear() {
    try {
      await kv.del(COOKIE_KEY);
    } catch (error) {
      console.error('Error clearing cookies from KV:', error);
    }
  },
};
