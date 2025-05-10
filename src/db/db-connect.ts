import mongoose, { MongooseError } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.MONGODB_URI;

if (!mongoUrl) {
  throw new Error("mongo db url is required");
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected");
  } catch (err: unknown) {
    if (err instanceof mongoose.Error) {
      console.error(`Mongoose error: ${err}`);
    } else if (err instanceof Error) {
      console.error(`Mongoose Error: ${err}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;
