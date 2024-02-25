const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const store = require("connect-mongo");
const path = require("path");
const { Server } = require("socket.io");

const routes = require("./routes/apiRouter");
require("dotenv").config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // enable secure property while deploying to live env
      // secure: true,
      sameSite: true,
      maxAge: 86400000,
    },
    rolling: true,
    store: store.create({
      mongoUrl: process.env.DATABASE_URL,
      crypto: {
        secret: process.env.SESSION_STORE_KEY,
      },
    }),
  })
);

app.use(express.json());

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "production_local"
) {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  console.log("Env: ", process.env.NODE_ENV);
  app.use(
    cors({
      // origin: "http://localhost:3000",
      origin: true,
      credentials: true,
    })
  );
}

app.use("/api", routes);

const PORT = parseInt(process.env.PORT) || 8080;

const server = app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running at: ", process.env.PORT);
  } else {
    console.log("Server error: ", error);
  }
});

// app.get("/temp", (req, res) => {
//   res.send("<h1>Hello from server</h1>");
// });

const db = mongoose.connection;
try {
  mongoose.connect(process.env.DATABASE_URL);
  db.once("connected", () => {
    console.log("Database connected");
  });
} catch (error) {
  console.log("Db connection error: ", error);
}
db.on("error", (error) => {
  console.log("Db error: ", error);
});

// shift this to messageDataController? - didn't work
const io = new Server(
  server,
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "production_local"
    ? {}
    : {
        cors: {
          // origin: "http://localhost:3000",
          origin: true,
          credentials: true,
        },
      }
);
io.on("connection", (socket) => {
  // console.log("A user connected ", socket.id);
  socket.on("sendMessage", (data) => {
    data.time = new Date();
    socket.broadcast.emit("receiveMessage", data);
  });
});
