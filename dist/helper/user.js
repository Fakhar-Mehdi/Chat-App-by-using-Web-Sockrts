"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = exports.validateId = void 0;
const users = [];
const validateId = (id) => {
    return !id;
};
exports.validateId = validateId;
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if (!username || !room)
        return { error: "Username and room are required" };
    if (users.find((u) => u.username === username && u.room === room))
        return { error: "This user id already exist" };
    const user = { id, username, room };
    users.push(user);
    return { user };
};
exports.addUser = addUser;
const removeUser = (id) => {
    if ((0, exports.validateId)(id))
        return { error: "id is required and it must be a number" };
    const index = users.findIndex((u) => u.id === id);
    if (index === -1)
        return { error: "No user found against the given id" };
    return { user: users.splice(index, 1)[0] };
};
exports.removeUser = removeUser;
const getUser = (id) => {
    if ((0, exports.validateId)(id))
        return { error: "id is required and it must be a number" };
    return { user: users.find((u) => u.id === id) };
};
exports.getUser = getUser;
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    if (!room || typeof room !== "string")
        return {
            error: "room is required and it should be a string",
        };
    return users.filter((u) => room === u.room);
};
exports.getUsersInRoom = getUsersInRoom;
