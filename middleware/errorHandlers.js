// 404 for unknown routes
const notFound = (req, res) => res.status(404).json({ msg: "Route not found" });

// Central error handler so unexpected errors never crash a request silently
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Server Error" });
};

module.exports = { notFound, errorHandler };
