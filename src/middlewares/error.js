function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value (slug or unique field)" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
}

module.exports = { notFound, errorHandler };

