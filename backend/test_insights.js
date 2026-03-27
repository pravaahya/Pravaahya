const http = require('http');

async function test() {
  // Login to get token
  const loginRes = await fetch('http://127.0.0.1:5000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.ADMIN_USERNAME || 'pravaahya@gmail.com', password: process.env.ADMIN_PASSWORD || 'pravaahya@123' })
  });
  
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.log('Login failed:', loginData);
    return;
  }
  
  console.log('Got token, fetching insights...');
  const res = await fetch('http://127.0.0.1:5000/api/admin/insights', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  const data = await res.json();
  console.log('Insights Response:', data);
}

test();
