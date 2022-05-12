import { Server } from "socket.io";

const io = new Server({
  // options
  cors: "http://localhost:3000",
});

let onlineUsers = [];

const addNewUser = (userName, socket_id) => {
  !onlineUsers.some((user) => user.userName === userName) &&
    onlineUsers.push({ userName, socket_id });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socket_id !== socketId);
};

const getUser = (userId) => {
  console.log("online", onlineUsers);
  const data = onlineUsers.find((user) => {
    return user.userName == userId;
  });
  console.log("data", data);
  return data;
};
io.on("connection", (socket) => {
  //   [{ userId: 1, socket_id: s }];
  // ...
  console.log("a user connected");

  socket.on("newUser", (userid) => {
    console.log(userid);
    addNewUser(userid, socket.id);
    console.log(onlineUsers);
  });

  socket.on("message", (user) => {
    console.log(user.receiver);
    const users = getUser(user.receiver);
    console.log(users);
    users && io.to(users.socket_id).emit("getMessage", user.message);
  });

  socket.on("disconnect", () => {
    console.log("a user left");
    removeUser(socket.id);
  });
});

io.listen(4000);
