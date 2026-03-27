const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET || ''
});

instance.orders.create({ amount: 1000, currency: 'INR', receipt: 'test_123' })
  .then(order => console.log('RAZORPAY SUCCESS:', order))
  .catch(err => console.error('RAZORPAY ERROR:', err));
