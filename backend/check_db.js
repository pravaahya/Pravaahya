const mongoose = require('mongoose');

async function check() {
  console.log('Attempting MongoDB Seedlist Override Connection...');
  try {
    const startTime = Date.now();
    await mongoose.connect('mongodb://pravaahya_db_user:Pravaahya123@ac-28vn9v-shard-00-00.llgche7.mongodb.net:27017,ac-28vn9v-shard-00-01.llgche7.mongodb.net:27017,ac-28vn9v-shard-00-02.llgche7.mongodb.net:27017/?ssl=true&replicaSet=atlas-28vn9v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Pravaahya', { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected successfully natively in ${Date.now() - startTime}ms`);
    process.exit(0);
  } catch (err) {
    console.error('Connection Failed:', err.message);
    process.exit(1);
  }
}

check();
