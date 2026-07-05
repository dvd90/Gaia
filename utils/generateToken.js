const jwt = require("jsonwebtoken");

const jwtSecret = () => process.env.JWT_SECRET || process.env.jwtSecret;

// Sign synchronously so failures surface as normal exceptions
// (throwing inside the jwt.sign callback would crash the process)
const generateToken = userId =>
  jwt.sign({ user: { id: userId } }, jwtSecret(), { expiresIn: "10h" });

module.exports = { generateToken, jwtSecret };
