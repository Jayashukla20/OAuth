import mongoose from "mongoose";

// Function to connect database
const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);

    process.exit(1); // Stop server if DB fails
  }
};

export default connectDB;