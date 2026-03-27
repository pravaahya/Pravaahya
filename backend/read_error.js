const fs = require('fs');
const content = fs.readFileSync('crash.log', 'utf16le');
if (content.includes('TSError')) {
  const index = content.indexOf('TSError');
  console.log('--- ERROR TRACE ---');
  console.log(content.substring(index, index + 800));
} else {
  console.log(content.substring(0, 800));
}
