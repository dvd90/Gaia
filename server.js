require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4000;
// connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
// app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/challenges", require("./routes/api/challenges"));
app.use("/api/events", require("./routes/api/events"));

// FOR HEROKU DEPLOYMENT
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
