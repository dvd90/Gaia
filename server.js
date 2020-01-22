const express = require("express");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 4000;
// connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/challenges", require("./routes/api/challenges"));
app.use("/api/events", require("./routes/api/events"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
