#!/bin/bash

echo "🚀 Running Voyager Pre-checks..."

echo -e "
1. Checking Affiliated Mailboxes (GraphQL)..."
curl -i -X GET 'https://www.linkedin.com/voyager/api/graphql?queryId=voyagerMessagingDashAffiliatedMailboxes.da7e8047e61ae87c4b97ee31fed7d934' 
  -H 'accept: application/vnd.linkedin.normalized+json+2.1' 
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' 
  -H 'csrf-token: ajax:3174930809465974889' 
  -H 'referer: https://www.linkedin.com/preload/' 
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' 
  -H 'x-li-lang: en_US' 
  -H 'x-restli-protocol-version: 2.0.0' 
  -H 'Cookie: li_at=AQEDASgZjt8BJ-s2AAABnJM7NYgAAAGct0e5iE4Apa6odFWAi6kpyOC7XYq5k7tYQt8O5UjNBf9sqmb6uC9GdCCkVkkIU4jCFMGaTKyXBCPIa5lJZG5nUbvPgQWhngORFU2xnhqdWYNNYbMlr6DM4WMV; JSESSIONID="ajax:3174930809465974889"; liap=true; bcookie="v=2&f16abdbd-5df3-43dc-8673-012f62692f81"; bscookie="v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq";'

echo -e "

2. Checking Growth/IWE Restrictions..."
curl -i -X GET 'https://www.linkedin.com/voyager/api/voyagerGrowthIWERestriction' 
  -H 'accept: application/vnd.linkedin.normalized+json+2.1' 
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' 
  -H 'csrf-token: ajax:3174930809465974889' 
  -H 'referer: https://www.linkedin.com/preload/' 
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' 
  -H 'x-li-lang: en_US' 
  -H 'x-restli-protocol-version: 2.0.0' 
  -H 'Cookie: li_at=AQEDASgZjt8BJ-s2AAABnJM7NYgAAAGct0e5iE4Apa6odFWAi6kpyOC7XYq5k7tYQt8O5UjNBf9sqmb6uC9GdCCkVkkIU4jCFMGaTKyXBCPIa5lJZG5nUbvPgQWhngORFU2xnhqdWYNNYbMlr6DM4WMV; JSESSIONID="ajax:3174930809465974889"; liap=true; bcookie="v=2&f16abdbd-5df3-43dc-8673-012f62692f81"; bscookie="v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq";'

echo -e "

✅ Voyager checks finished."
