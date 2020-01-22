const mongoose = require("mongoose");
const db = `mongodb://${process.env.mongoUser}:${process.env.mongoPW}${process.env.mongoURI}`;

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
