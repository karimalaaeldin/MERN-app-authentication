import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

export default async function CONNECT_TO_DATABASE() {
  if (!MONGO_URI) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  try {
    const mongoDB = await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected successfully");
    return mongoDB;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.log(error);
    process.exit(1);
  }
}
