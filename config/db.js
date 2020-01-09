const mongoose = require("mongoose");
const config = require("config");
const db = `mongodb://${config.get("mongoUser")}:${config.get(
  "mongoPW"
)}${config.get("mongoURI")}`;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    console.log("Mongodb connected...");
  } catch (err) {
    console.log(err.message);
    // exit process
    process.exit(1);
  }
};

module.exports = connectDB;
