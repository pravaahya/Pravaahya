const fs = require('fs');
const { execSync } = require('child_process');
const envContent = fs.readFileSync('../.env', 'utf8');
const lines = envContent.split('\n');

for (const line of lines) {
  const match = line.match(/^(.*?)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    if (key === 'MONGODB_URI') {
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      execSync(`npx vercel env add MONGODB_URI production`, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
      break;
    }
  }
}
