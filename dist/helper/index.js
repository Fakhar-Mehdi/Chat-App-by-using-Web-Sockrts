"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leavingMessage = exports.welcomeMessage = exports.makePackage = void 0;
const moment_1 = __importDefault(require("moment"));
const makePackage = (username, message) => ({
    username,
    message,
    createdAt: (0, moment_1.default)(new Date().getTime()).format("h:mm A"),
});
exports.makePackage = makePackage;
const welcomeMessage = (name) => `${name} Has Joined`;
exports.welcomeMessage = welcomeMessage;
const leavingMessage = (name) => `${name} Has Left`;
exports.leavingMessage = leavingMessage;
