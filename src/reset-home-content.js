/**
 * Сбрасывает сохранённый контент главной: дальше подставляются строки из src/data/homeDefaults.js.
 * Запуск: npm run reset-home-content
 */
require("./config/env");
const mongoose = require("mongoose");
const { assertMongoUri } = require("./config/env");
const { connectDB } = require("./config/db");
const HomeContent = require("./models/HomeContent");

async function run() {
  const { mongoUri } = assertMongoUri();
  await connectDB(mongoUri);
  await HomeContent.findOneAndUpdate({}, { snapshot: {} }, { upsert: true });
  // eslint-disable-next-line no-console
  console.log("HomeContent snapshot очищен — API отдаёт тексты из HOME_DEFAULTS.");
  await mongoose.disconnect();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
