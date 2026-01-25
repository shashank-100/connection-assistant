#!/bin/bash

curl -X POST https://courteous-empathy-production-9e68.up.railway.app/auth/linkedin \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "shashank",
    "cookies": [
      {"name": "bcookie", "value": "v=2&c8032746-d5f8-4db5-8c26-4963332a1080", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "bscookie", "value": "v=1&202601070517496e46bc1b-f2b9-4741-8f28-302f2453bae5AQE3XSF8lEYvQC3botcWID0fNjHuxF5T", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "timezone", "value": "Asia/Calcutta", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "li_theme", "value": "light", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "li_theme_set", "value": "app", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "li_sugr", "value": "aac5a2b2-5b67-43e4-8c00-4049c440d911", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "_guid", "value": "de4e1b01-a2b8-4e3a-97ba-4af779f51fe0", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "dfpfpt", "value": "45d622946d3949a98f3507a391bc8ab3", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "li_rm", "value": "AQERIEWzk2hovQAAAZvbBbSfAlys7EHFlxCkOnhzWD7i5y9v0wqDUnr9Q9DqzOIUpSOaIW1Fr2ubYlE8kX6W81LiVHHxONvGruXc6lRegtVVKkp2wzyVj-ZH", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "visit", "value": "v=1&M", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "liap", "value": "true", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "li_at", "value": "AQEDASgZjt8E9IT-AAABm9sOOxMAAAGb_xq_E04AO1GrzqjR80Y6PsR07SWfXCr3yUbfMan7OrZNerKny-xsaNZx7e1a1ZeJBzG2e82s5xsJoPws1VUcjsKfjjKJ7daNf-lws9SoyTSoLj3Mir7Dou3X", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "JSESSIONID", "value": "ajax:1849305005458482706", "domain": ".www.linkedin.com", "path": "/", "secure": true},
      {"name": "lang", "value": "v=2&lang=en-us", "domain": ".linkedin.com", "path": "/", "secure": true},
      {"name": "lidc", "value": "b=TB15:s=T:r=T:a=T:p=T:g=6048:u=1099:x=1:i=1769318421:t=1769393721:v=2:sig=AQEnZvmnXPpc6ZoMfqNT4RSgdsq4-T-0", "domain": ".linkedin.com", "path": "/", "secure": true}
    ]
  }'
