require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
