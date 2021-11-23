const config = require("./config");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser((secret = config.cookie.secret)));

const httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

const user = require("./components/user/network");
const auth = require("./components/auth/network");
const message = require("./components/message/network");
const errors = require("./network/errors");
const authMiddle = require("./middlewears/authentication");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser((secret = config.cookie.secret)));


// Sockets
io.on("connection", (socket) => {
  require("./components/message/socket")(io, socket);
});

// Router
app.get("/", (req, res) => {
  res.redirect("http://127.0.0.1:3000/home");
});
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/message", message);

// Views
app.use(
  "/home",
  express.static(path.join(__dirname + "/public/views/home.html"))
);
app.use(
  "/auth/login",
  express.static(path.join(__dirname + "/public/views/login.html"))
);
app.use(
  "/auth/signup",
  express.static(path.join(__dirname + "/public/views/signup.html"))
);


app.get("/chat", authMiddle("logged"), (req, res) => {  
  io.use((socket, next) => {
    socket.user = req.user;
    next()
  });
  res.sendFile(path.join(__dirname + "/public/views/chat.html"));
});

// Default 404 response
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname + "/public/views/404.html"));
    return;
  }

  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

app.use(errors);

httpServer.listen(config.app.port, () => {
  console.log(`Listening at ${config.app.dir}`);
});
