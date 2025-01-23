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
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
  })
);

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
