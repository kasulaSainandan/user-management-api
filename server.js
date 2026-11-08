require("dotenv").config();
require("express-async-errors");

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\nServer running: http://localhost:${PORT}`);
      console.log(`Health check:   http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
