const http = require('http');

const data = JSON.stringify({
  amount: 100, currency: "INR",
  user: { name: "Test", email: "test@example.com", phone: "987", address: { houseNo: "1", streetArea: "2", cityVillage: "3", district: "4", state: "5", country: "India", pincode: "123456" } },
  products: [{ product: "123", name: "Item", quantity: 1, price: 100 }]
});

const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/payment/create-order', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    const orderId = json.order._id;
    console.log("CREATED ORDER ID:", orderId);
    http.get(`http://localhost:5000/api/orders/${orderId}/invoice`, invRes => {
       console.log("INVOICE STATUS:", invRes.statusCode);
       let invBody = 0;
       invRes.on('data', c => invBody += c.length);
       invRes.on('end', () => console.log("INVOICE LENGTH:", invBody));
    });
  });
});
req.write(data); req.end();
