const https = require('https');

function get(url) {
  return new Promise(res => {
    https.get(url, (r) => {
      let d = '';
      r.on('data', chunk => d += chunk);
      r.on('end', () => res(JSON.parse(d)));
    });
  });
}

async function run() {
  const srv = await get('https://dns.google/resolve?name=_mongodb._tcp.pravaahya.llgche7.mongodb.net&type=SRV');
  const txt = await get('https://dns.google/resolve?name=pravaahya.llgche7.mongodb.net&type=TXT');
  console.log("SRV:", JSON.stringify(srv.Answer));
  console.log("TXT:", JSON.stringify(txt.Answer));
}
run();
