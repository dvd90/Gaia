require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4000;
// connect DB
connectDB();

//TODO CORS !!!!
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("🌍 GAIA 🌍 API Running"));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.set("Content-Type", "application/json");
//   next();
// });

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/challenges", require("./routes/api/challenges"));
app.use("/api/events", require("./routes/api/events"));
app.use("/api/footprint", require("./routes/api/footprintApi"));

// FOR HEROKU DEPLOYMENT (Not Doing it anymore)
// Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
