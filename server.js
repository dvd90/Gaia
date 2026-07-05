require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 4000;
// connect DB
connectDB();

// Allow only the configured client origin in production, everything in dev
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*"
  })
);

// Init Middleware
app.use(express.json());
app.get("/", (req, res) => res.send("🌍 GAIA 🌍 API Running"));

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/challenges", require("./routes/api/challenges"));
app.use("/api/events", require("./routes/api/events"));
app.use("/api/footprint", require("./routes/api/footprintApi"));

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

// Central error handler so unexpected errors never crash a request silently
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Server Error" });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
