const mongoose = require("mongoose");

// Prefer a single MONGO_URI; fall back to the legacy split variables
const buildUri = () =>
  process.env.MONGO_URI ||
  `mongodb://${process.env.mongoUser}:${process.env.mongoPW}${process.env.mongoURI}`;

const connectDB = async () => {
  try {
    await mongoose.connect(buildUri());

    console.log("Mongodb connected...");
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    // exit process
    process.exit(1);
  }
};

module.exports = connectDB;
