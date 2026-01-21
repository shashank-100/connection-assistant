(function() {
  const vUrl = prompt("Enter your Vercel API URL (e.g., https://your-app.vercel.app/api/index):");
  if (!vUrl) return;

  const cookies = document.cookie.split(';').map(c => {
    const [name, value] = c.trim().split('=');
    return {
      name,
      value,
      domain: '.linkedin.com',
      path: '/'
    };
  });

  fetch(vUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'linkedin-me',
      cookies: cookies
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.data.authenticated) {
      alert("Success! Connected as: " + data.data.name);
    } else {
      alert("Authentication Failed. Check console for details.");
    }
  })
  .catch(err => {
    alert("Connection Error. Check console.");
  });
})();
