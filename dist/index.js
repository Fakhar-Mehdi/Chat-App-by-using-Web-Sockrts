"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socketIo = __importStar(require("socket.io"));
const user_1 = require("helper/user");
const helper_1 = require("helper");
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
let server = http_1.default.createServer(app);
const publicDirectoryPath = path_1.default.join(__dirname, "../public");
const io = new socketIo.Server(server);
app.use(express_1.default.static(publicDirectoryPath));
const ADMIN = "Admin";
io.on("connection", (socket) => {
    socket.addListener("join", ({ username, room }, callback) => {
        const { user, error } = (0, user_1.addUser)({ id: socket.id, username, room });
        if (error) {
            callback(error);
            return;
        }
        socket.join(user.room);
        socket.emit("sendMessage", (0, helper_1.makePackage)(ADMIN, "Welcome"));
        socket.broadcast
            .to(user.room)
            .emit("sendMessage", (0, helper_1.makePackage)(ADMIN, (0, helper_1.welcomeMessage)(user.username)));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: (0, user_1.getUsersInRoom)(user.room),
        });
    });
    socket.addListener("client-sent", (message, callback) => {
        const { user, error } = (0, user_1.getUser)(socket.id);
        if (error) {
            callback(error);
            return;
        }
        io.to(user.room).emit("sendMessage", (0, helper_1.makePackage)(user.username, message));
    });
    socket.addListener("shareLocation", (location, callback) => {
        const { user, error } = (0, user_1.getUser)(socket.id);
        if (error) {
            callback(error);
            return;
        }
        const link = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        io.to(user.room).emit("locationReceived", {
            link,
            username: user.username,
            createdAt: (0, moment_1.default)(new Date().getTime()).format("h:mm A"),
        });
    });
    socket.on("disconnect", () => {
        const { user, error } = (0, user_1.getUser)(socket.id);
        if (!user)
            return;
        if (error) {
            return;
        }
        io.to(user.room).emit("sendMessage", (0, helper_1.makePackage)(ADMIN, (0, helper_1.leavingMessage)(user.username)));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: (0, user_1.getUsersInRoom)(user.room),
        });
    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Successfully Listening on Port: ${port}`);
});
exports.default = server;
