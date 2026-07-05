const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../utils/generateToken");

module.exports = (req, res, next) => {
  // Accept the legacy x-auth-token header or a standard Bearer token
  const bearer = req.header("authorization");
  const token =
    req.header("x-auth-token") ||
    (bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : null);

  // Check if no token
  if (!token)
    return res.status(401).json({ msg: "No token, authorisation denied" });

  // Verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret());

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
