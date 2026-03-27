import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'c:/Users/Dell/OneDrive/Desktop/Startup/Pravaahya/Website/.env' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is totally missing from .env.");
  process.exit(1);
}

console.log("Attempting direct connection to:", uri.replace(/:([^:@]+)@/, ':<HIDDEN>@'));

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS! MongoDB is reachable and connected.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED! Direct Error Data:");
    console.error(err);
    process.exit(1);
  });
