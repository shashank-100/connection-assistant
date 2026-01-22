import fs from 'fs';

function netscapeToJson(netscapeStr) {
    const lines = netscapeStr.split('\n');
    const cookies = [];

    for (let line of lines) {
        if (!line.trim() || line.startsWith('#')) continue;

        const parts = line.split('\t');
        if (parts.length < 7) continue;

        const [domain, flag, path, secure, expiration, name, value] = parts;

        cookies.push({
            name: name,
            value: value.replace(/^"(.*)"$/, '$1'),
            domain: domain.startsWith('.') ? domain : domain,
            path: path,
            expires: parseInt(expiration),
            httpOnly: flag === 'TRUE',
            secure: secure === 'TRUE',
            sameSite: 'Lax'
        });
    }
    return cookies;
}

const netscapeContent = fs.readFileSync('/Users/shashank/geodo-vercel-agent-browser/agentlinkedin/cookies.txt', 'utf8');
const cookiesJson = netscapeToJson(netscapeContent);
fs.writeFileSync('/Users/shashank/geodo-vercel-agent-browser/agentlinkedin/cookies.json', JSON.stringify(cookiesJson, null, 2));
console.log('Successfully converted cookies to cookies.json');
