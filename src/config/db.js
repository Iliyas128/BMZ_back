const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 12_000,
    });
  } catch (err) {
    const msg = err && err.message ? String(err.message) : "";
    if (/bad auth|authentication failed/i.test(msg)) {
      throw new Error(
        "MongoDB authentication failed. Check user/password in MONGO_URI, database name, and authSource (often ?authSource=admin for Atlas)."
      );
    }
    if (/ENOTFOUND|getaddrinfo/i.test(msg)) {
      throw new Error(
        "MongoDB host not found. Check cluster hostname and network/DNS in MONGO_URI."
      );
    }
    throw err;
  }
}

function getConnectionState() {
  return mongoose.connection.readyState;
}

/** 0 disconnected, 1 connected, 2 connecting, 3 disconnecting */
function connectionStateLabel() {
  const s = mongoose.connection.readyState;
  const map = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  return map[s] || "unknown";
}

module.exports = { connectDB, getConnectionState, connectionStateLabel };
