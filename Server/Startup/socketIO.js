const { Server } = require("socket.io");

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
  });

  require("../Routes/liveMatchSocketIO")(io);
};
