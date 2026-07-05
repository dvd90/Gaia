const { generateToken } = require("../utils/generateToken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const USER_ID = "607f1f77bcf86cd799439011";
const OTHER_ID = "507f1f77bcf86cd799439099";

const authHeader = (id = USER_ID) => ({ "x-auth-token": generateToken(id) });

// Error shaped like mongoose's CastError for bad ObjectIds
const castError = () => {
  const err = new Error("Cast to ObjectId failed");
  err.name = "CastError";
  err.kind = "ObjectId";
  return err;
};

module.exports = { USER_ID, OTHER_ID, authHeader, castError };
