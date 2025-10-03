
import { Server } from "socket.io";
import http from "http";
import express from "express";

 const app = express();

 const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatapp-oobh.onrender.com",
    methods: ["GET", "POST"],
  },
 });

// realtime message code goes here
const users = {};
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

 
 

// used to listen events on server side.
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Online users: ", users);
  }
  // used to send the events to all connected users
  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("send-msg", (data) => {
    const { to, from, message } = data;

    // get receiver socketId
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      // send to specific receiver
      io.to(receiverSocketId).emit("msg-receive", {
        from,
        message,
      });
    }
  });



  // used to listen client side events emitted by server side (server & client)
  socket.on("disconnect", () => {
    console.log(" user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
