import { NextResponse } from 'next/server';
import { LinkedInAgentAPI } from '@/lib/agent-api/linkedin';
import { launchServerlessBrowser } from '@/lib/agent-api/serverless-browser';
import { LinkedInAgentService } from '@/lib/agent-browser/services/linkedin';
// import { LinkedInCookieStore } from '@/lib/agent-api/linkedinCookies';
import path from 'path';
import fs from 'fs';

export const maxDuration = 60;

async function runProgrammaticAction(action: string, params: any) {
  const browser = await launchServerlessBrowser();
  try {
    const page = browser.getPage();
    const context = page.context();

    // const cookies = await LinkedInCookieStore.load();
    // if (cookies) {
    //   await context.addCookies(cookies);
    // }

    const service = new LinkedInAgentService(browser);
    const loggedIn = await service.login();

    if (!loggedIn) {
      return { success: false, error: 'Session expired — re-login required', requiresLogin: true };
    }

    let result;
    switch (action) {
      case 'search':
        const people = await service.searchPeople(params.searchTerm);
        if (people.length > 0) {
          await service.sendConnectRequest(people[0].profileUrl);
        }
        result = { success: true, data: people };
        break;
      case 'visit':
      case 'message':
        result = { success: false, error: 'Action not implemented programmatically yet' };
        break;
      default:
        result = { success: false, error: 'Action not implemented programmatically yet' };
    }

    // const updatedCookies = await context.cookies();
    // await LinkedInCookieStore.save(updatedCookies);

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkAuth = searchParams.get('checkAuth');

  if (checkAuth === 'true') {
    return NextResponse.json(await LinkedInAgentAPI.checkAuthStatus());
  }

  const response = await LinkedInAgentAPI.getAnalytics();
  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, params } = body;

  const isServerless = process.env.VERCEL === '1' || process.env.USE_PROGRAMMATIC === 'true';

  if (isServerless) {
    return NextResponse.json(await runProgrammaticAction(action, params));
  }

  switch (action) {
    case 'search':
      return NextResponse.json(await LinkedInAgentAPI.searchPeople(params.searchTerm));
    case 'visit':
      return NextResponse.json(await LinkedInAgentAPI.visitProfiles(params.searchTerm, params.max));
    case 'connect':
      return NextResponse.json(await LinkedInAgentAPI.sendConnectionRequest(params.profileUrl));
    case 'message':
      return NextResponse.json(
        await LinkedInAgentAPI.sendMessages(params.message, params.filter, params.max)
      );
    default:
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  }
}
