const controller = require("./index");

exports = module.exports = function (io, socket) {
  //listen on new_message
  socket.on("new_message", async (data) => {
    const message = await controller.upsert(socket.user.id, data);
    await io.sockets.emit("messages", message);
  });
};
