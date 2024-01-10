import dotenv from "dotenv";
import express from "express";
import path from "path";
import http from "http";
import * as socketIo from "socket.io";
import { addUser, getUser, getUsersInRoom } from "helper/user";
import { makePackage, welcomeMessage, leavingMessage } from "helper";
import moment from "moment";

dotenv.config();

const app = express();
let server = http.createServer(app);
// app.use(express.json());
const publicDirectoryPath = path.join(__dirname, "../public");

const io = new socketIo.Server(server);
app.use(express.static(publicDirectoryPath));
const ADMIN = "Admin";
io.on("connection", (socket) => {
  socket.addListener("join", ({ username, room }, callback) => {
    const { user, error }: any = addUser({ id: socket.id, username, room });

    if (error) {
      callback(error);
      return;
    }
    socket.join(user.room);
    socket.emit("sendMessage", makePackage(ADMIN, "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("sendMessage", makePackage(ADMIN, welcomeMessage(user.username)));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.addListener("client-sent", (message: any, callback) => {
    const { user, error } = getUser(socket.id);

    if (error) {
      callback(error);
      return;
    }
    io.to(user.room).emit("sendMessage", makePackage(user.username, message));
  });

  socket.addListener("shareLocation", (location, callback) => {
    const { user, error } = getUser(socket.id);

    if (error) {
      callback(error);
      return;
    }
    const link = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    io.to(user.room).emit("locationReceived", {
      link,
      username: user.username,
      createdAt: moment(new Date().getTime()).format("h:mm A"),
    });
  });

  socket.on("disconnect", () => {
    const { user, error } = getUser(socket.id);
    if (!user) return;

    if (error) {
      // callback(error);
      return;
    }

    io.to(user.room).emit(
      "sendMessage",
      makePackage(ADMIN, leavingMessage(user.username))
    );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});
const port = process.env.PORT || 3000;

// mongoose
//   .connect(process.env.DB_CONNECTION_STRING || "")
//   .then(() => {
//     console.log("Successfully connected to mongodb");
//     server.listen(port, () => {
//       console.log(`Successfully Listening on Port: ${port}`);
//     });
//   })
//   .catch((e) => {
//     console.log(
//       `Unable to connect to mongodb and listen to port ${port}.\nFollowing Error Occurred: ${e}`
//     );
//   });

server.listen(port, () => {
  console.log(`Successfully Listening on Port: ${port}`);
});

export default server;
