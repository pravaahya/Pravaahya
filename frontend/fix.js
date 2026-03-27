const fs = require('fs');
const files = [
  'src/app/admin/products/page.tsx',
  'src/app/admin/orders/page.tsx',
  'src/app/admin/coupons/page.tsx',
  'src/app/admin/collections/page.tsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/const token =\r?\n\s*sessionStorage\.removeItem\("pravaahya_token"\);/g, 'const token = sessionStorage.getItem("pravaahya_token");');
  fs.writeFileSync(f, c);
});
console.log('Fixed storage footprints successfully.');
