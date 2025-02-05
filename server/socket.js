const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.emit("testMessage", "Hello from server!");
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

module.exports = { initSocket, getIo };
