const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());

// Allow only the configured client origin in production, everything in dev
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*"
  })
);

// Init Middleware
app.use(express.json());

app.get("/", (req, res) => res.send("🌍 GAIA 🌍 API Running"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/challenges", require("./routes/api/challenges"));
app.use("/api/events", require("./routes/api/events"));
app.use("/api/footprint", require("./routes/api/footprintApi"));

const { notFound, errorHandler } = require("./middleware/errorHandlers");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
