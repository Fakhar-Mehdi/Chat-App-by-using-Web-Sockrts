const users: any[] = [];
interface IUser {
  id: string;
  username: string;
  room: string;
}

export const validateId = (id: any) => {
  return !id;
};

export const addUser = ({ id, username, room }: IUser) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) return { error: "Username and room are required" };
  if (users.find((u) => u.username === username && u.room === room))
    return { error: "This user id already exist" };
  const user = { id, username, room };
  users.push(user);
  return { user };
};

export const removeUser = (id: any) => {
  if (validateId(id))
    return { error: "id is required and it must be a number" };

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return { error: "No user found against the given id" };
  return { user: users.splice(index, 1)[0] };
};

export const getUser = (id: any) => {
  if (validateId(id))
    return { error: "id is required and it must be a number" };
  return { user: users.find((u) => u.id === id) };
};

export const getUsersInRoom = (room: any) => {
  room = room.trim().toLowerCase();
  if (!room || typeof room !== "string")
    return {
      error: "room is required and it should be a string",
    };
  return users.filter((u) => room === u.room);
};
