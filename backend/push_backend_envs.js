const fs = require('fs');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('../.env', 'utf8');
const lines = envContent.split('\n');

const backendKeys = [
  'MONGODB_URI', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER',
  'RAZORPAY_KEY_ID', 'RAZORPAY_SECRET', 'ADMIN_PHONES', 'ADMIN_USERNAME',
  'ADMIN_PASSWORD', 'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL', 'REDIS_URL'
];

for (const line of lines) {
  const match = line.match(/^(.*?)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    
    if (backendKeys.includes(key)) {
      console.log(`Pushing ${key}...`);
      try {
        execSync(`npx vercel env add ${key} production`, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
        console.log(`Successfully added ${key}`);
      } catch(e) {
        // If it already exists, Vercel might throw or prompt, so we can use rm first or just ignore
        console.error(`Error adding ${key}, proceeding...`);
      }
    }
  }
}
console.log('Finished pushing envs');
