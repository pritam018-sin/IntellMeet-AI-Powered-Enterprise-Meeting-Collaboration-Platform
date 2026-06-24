const emailToSocketMaping = new Map();
const socketToEmailMapping = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("room:join", (data) => {
      console.log("User Joined Room:", data);
      const { email, room } = data;
      socket.join(room);
      emailToSocketMaping.set(email, socket.id);
      socketToEmailMapping.set(socket.id, email);
      io.to(socket.id).emit("room:join", { socketId: socket.id, email });
      socket.broadcast.to(room).emit("user:joined", {email, id: socket.id});
    });

    socket.on("user:call", ({to, offer, email}) => {
      io.to(to).emit("incoming:call", {from: socket.id, offer, email});
    });

    socket.on("call:accepted", ({to, ans}) => {
      io.to(to).emit("call:accepted", {from: socket.id, ans});
    });

    socket.on("peer:nego:needed", ({to, offer}) => {
      io.to(to).emit("peer:nego:needed", {from: socket.id, offer});
    });

    socket.on("peer:nego:done", ({to, ans}) => {
      io.to(to).emit("peer:nego:final", {from: socket.id, ans});
    });

    socket.on("peer:ice-candidate", ({to, candidate}) => {
      io.to(to).emit("peer:ice-candidate", {from: socket.id, candidate});
    });

    socket.on("room:leave", ({ meetingCode }) => {
      socket.leave(meetingCode);

      socket.to(meetingCode).emit(
        "user-left",
        {
          socketId: socket.id,
        }
      );
    });

    socket.on("room:end", ({ meetingCode }) => {
      socket.to(meetingCode).emit("meeting:ended");
    });

    socket.on("chat:send", ({ room, message, senderName }) => {
      socket.to(room).emit("chat:receive", { message, senderName, timestamp: new Date().toISOString() });
    });

    socket.on("screen:state", ({ room, isSharing }) => {
      socket.to(room).emit("screen:state", { isSharing, socketId: socket.id });
    });

    socket.on("room:permissions:update", ({ room, permissions }) => {
      socket.to(room).emit("room:permissions:update", { permissions });
    });

    socket.on("room:mute-all", ({ room }) => {
      socket.to(room).emit("room:mute-all");
    });

    socket.on("room:remove-user", ({ socketId }) => {
      io.to(socketId).emit("room:kicked");
    });

    socket.on("room:mute-user", ({ socketId }) => {
      io.to(socketId).emit("room:muted");
    });

    socket.on("user:raise-hand", ({ room, name }) => {
      socket.to(room).emit("user:raise-hand", { name });
    });

    socket.on("room:caption", ({ room, caption }) => {
      socket.to(room).emit("room:caption", { caption });
    });

    socket.on("disconnect", () => {
      console.log(
        "User Disconnected:",
        socket.id
      );
    });
  });
};

export default initializeSocket;