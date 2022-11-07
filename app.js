const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");
const socket = require("socket.io");
const http = require("http");
const sign = require("./router/sign");
const cookie = require("./router/cookie");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
});
db.connect((err) => {
  if (err) console.error(err);
  console.log("db연결성공");
});

//일반 express 서버
const app = express();

// 일반 express 서버를 http 서버로 업그레이드
const server = http.createServer(app);

//업그레이드된 서버를 소켓서버로
const io = socket(server, {
  cors: {
    origin: true,
  },
});

app.use(morgan("short"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/sign", sign);
app.use("/cookie", cookie);

app
  .route("/")
  .get((req, res) => {
    db.query(`select * from users`, (err, ok) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(ok);
    });
  })
  .post((req, res) => {
    db.query(
      `insert into users (name,age,married) values('${req.body.name}',${
        req.body.age
      },${req.body.married == undefined ? 0 : req.body.married});`,
      (err, ok) => {
        if (err) {
          console.error(err);
          return res.send(err);
        }
        console.log("유저등록성공");
        return res.json(ok);
      }
    );
  });

app.route("/:id").get((req, res) => {
  // console.log(req.params.id);
  if (req.params.id !== "favicon.ico") {
    db.query(`select * from users where id=${req.params.id};`, (err, ok) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }
      if (ok[0] !== undefined) {
        console.log("유저가 있습니다.");
        return res.send(ok[0]);
      }
      console.log("유저가 없습니다.");
      return res.send("user is not found");
    });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

io.on("connection", (socket) => {
  console.log(`sessionId : ${socket.id}님이 접속하였습니다`);

  const setCount = (room) => {
    let count = 0;
    for (let [i, v] of socket.adapter.sids) {
      if (v.has(room)) count++;
    }
    io.to(room).emit("count", count);
  };

  // socket.use((socket, next) => {
  //   console.log(socket);
  //   next();
  // });

  socket.on("joinRoom", (data) => {
    socket.join(data);
    setCount(data);
    io.in(data)
      .except(socket.id)
      .emit("joinMessage", `${socket.id}님이 들어왔습니다.`);
  });

  socket.on("chatting", (data) => {
    console.log(socket.rooms, data);
    if (socket.rooms.has(data.roomName)) {
      io.in(data.roomName).except(socket.id).emit("otherMessage", data.msg);
      io.to(socket.id).emit("myMessage", data.msg);
    }
  });

  socket.on("leave", (data) => {
    const someone = socket.id;
    socket.leave(data);
    setCount(data);
    io.in(data).emit("leaveMessage", `${someone}님이 나갔습니다.`);
  });

  socket.on("disconnect", (data) => {
    console.log(data);
  });
});

server.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `app is running on http://${process.env.HOST}:${process.env.PORT}`
  );
});
