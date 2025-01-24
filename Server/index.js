require("express-async-errors");
const express = require("express");
const http = require("http");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Load env
if (process.env.NODE_ENV === "development") require("dotenv").config({ path: "./.env.development" });
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    preflightContinue: true,
  })
);

// Handle preflight requests (OPTIONS)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Ensure this is correct
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin");
  res.send();
});

//Import db
require("./Startup/db")();

//Import Routes
require("./Startup/routes")(app);

//SocketIO intialization
const server = http.createServer(app);
require("./Startup/socketIO")(server);

//Error logging
require("./Startup/errorLogging")();

//Error handling
const errorHandler = require("./Startup/errorHandling");
app.use(errorHandler);

//Homepage
app.get("/api/ClubChronicles", (req, res) => {
  res.status(200).json({ message: "Welcome to the ClubChronicles." });
});

// Start Server
const port = process.env.PORT || 3000;
server.listen(port);

module.exports = server;
