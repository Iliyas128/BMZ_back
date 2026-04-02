/**
 * Load .env before any other app code reads process.env.
 * Call from server.js only (single entry).
 */
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

function normalizeMongoUri(raw) {
  if (raw == null || typeof raw !== "string") return "";
  let u = raw.trim();
  if (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  return u;
}

function assertMongoUri() {
  const mongoUri = normalizeMongoUri(process.env.MONGO_URI);
  if (!mongoUri) {
    throw new Error(
      'MONGO_URI is missing. Set it in back/.env (e.g. mongodb+srv://user:pass@cluster/dbname?retryWrites=true&w=majority)'
    );
  }
  if (!/^mongodb(\+srv)?:\/\//i.test(mongoUri)) {
    throw new Error(
      `MONGO_URI must start with "mongodb://" or "mongodb+srv://". Current value looks invalid (check quotes, spaces, or typos in back/.env).`
    );
  }
  return { mongoUri };
}

function assertEnv() {
  const { mongoUri } = assertMongoUri();

  if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 8) {
    throw new Error(
      "JWT_SECRET must be set in back/.env and be at least 8 characters long."
    );
  }

  return { mongoUri };
}

module.exports = { normalizeMongoUri, assertMongoUri, assertEnv };
