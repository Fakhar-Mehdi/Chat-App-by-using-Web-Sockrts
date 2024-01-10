import moment from "moment";

// export const makePackage = (username: string , message: string) => `
//   ${moment(new Date().getTime()).format("h:mm A")} - ${data}`;

export const makePackage = (username: string, message: string) => ({
  username,
  message,
  createdAt: moment(new Date().getTime()).format("h:mm A"),
});

export const welcomeMessage = (name: string) => `${name} Has Joined`;
export const leavingMessage = (name: string) => `${name} Has Left`;
