const http = require('http');
const Order = require('./src/models/order.model').default;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI, {}).then(async () => {
    const order = await Order.findOne({}).sort({ createdAt: -1 });
    console.log("LATEST MONGODB ORDER ID:", order._id);
    
    // Simulate API request organically
    const req = http.get(`http://localhost:5000/api/orders/${order._id}/invoice`, (res) => {
        console.log("INVOICE STATUS CODE:", res.statusCode);
        let data = '';
        res.on('data', chunk => data += chunk.length);
        res.on('end', () => console.log("INVOICE BUFFER LENGTH:", data));
    });
    
}).catch(console.error);
