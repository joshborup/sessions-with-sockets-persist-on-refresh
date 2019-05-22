const express = require("express");
const app = express();
const server = require("http").createServer(app);
const sessionService = require("./sessionService");
const session = require("express-session");
const io = require("socket.io")(server);
var pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser("somesecret"));
app.use(
  session({
    store: new pgSession({
      conString: process.env.CONNECTION_STRING
    }),
    secret: "somesecret",
    resave: true,
    key: "express.sid",
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

const massive = require("massive");
require("dotenv").config();
let db;
massive(process.env.CONNECTION_STRING).then(databaseInstance => {
  db = databaseInstance;
});

io.use(function(socket, next) {
  const parseCookie = cookieParser("somesecret");
  let handshake = socket.request;
  parseCookie(handshake, null, function(err, data) {
    sessionService.get(handshake, next, db);
  });
});

app.get("/", (req, res) => {
  if (req.query.name) {
    req.session.user = req.query.name;
    res.send(req.session);
  } else {
    res.send("send a name query");
  }
});

io.sockets.on("connection", socket => {
  // code here lives as long as the socket session is alive
  console.log("cool", socket.request.session.sess.user);
  io.on("message", message => {
    console.log(message);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
