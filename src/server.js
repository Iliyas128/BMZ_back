require("./config/env");
const app = require("./app");
const { assertEnv } = require("./config/env");

const port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  try {
    const { mongoUri } = assertEnv();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

module.exports = app;
