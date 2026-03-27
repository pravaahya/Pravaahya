import mongoose from "mongoose";
import dns from "dns";

// Fix Windows DNS resolution issue for Atlas +srv connection strings by injecting global resolvers
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Warning: MongoDB connection failed natively -> ${error.message}`);
    console.error("The Express API will remain online, but database queries will time out mathematically until valid credentials are provided.");
    // Removed process.exit(1) to prevent the server from committing suicide when offline.
  }
};
