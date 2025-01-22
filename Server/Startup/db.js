const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function initializeDatabase() {
  // Determine database URL based on environment
  const dbUrl = process.env.MONGO_DB_URI;

  // Validate environment variables
  if (!dbUrl) {
    const error = new Error(`MongoDB URI not found!`);
    winston.error(error.message);
    throw error;
  }

  // Handle application termination
  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (err) {
      winston.error("Error during MongoDB connection closure:", err);
      process.exit(1);
    }
  });

  // Connect to MongoDB
  return mongoose
    .connect(dbUrl)
    .then(() => {
      console.log(`Connected to MongoDB`);
    })
    .catch((err) => {
      console.log(`Error connecting to MongoDB`, err);
      throw err;
    });
};
