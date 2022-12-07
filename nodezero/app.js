const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
dotenv.config();

const app = express();

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public"))); //localhost:8000/public/003_004.jpg가 아닌 localhost:8000/003_004.jpg에 접속가능함 (보안UP)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "kimkyeongbeom4844",
    cookie: {
      httpOnly: true,
    },
  })
);

app.use("/category", (req, res, next) => {
  //app.use, .get .post .put의 첫번째 인자를 생략하면 기본값인'/'로 설정됨
  console.log("url에 /category 패턴이 들어가있는 모든 요청에 실행");
  next();
});

app.set("port", process.env.PORT || 8000);

app.route("/").get((req, res) => {
  console.log(req.session.cookie);
  res.sendFile(path.join(__dirname, "index.html"));
});

app.route("/category").get((req, res) => {
  res.send(`hello :)`);
});

app.route("/category/:name").get((req, res) => {
  res.send(`hello ${req.params.name}`);
});

app.listen(app.get("port"), () => {
  console.log(`app is running on http://localhost:${app.get("port")}`);
});

// const http = require("http");
// const fs = require("fs").promises;
// const path = require("path");

// const server = http.createServer(async (req, res) => {
//   res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
//   const file = await fs.readFile(path.join(__dirname, "index.html"));
//   res.end(file);
// });

// server.listen(8000, () => {
//   console.log("server is running on http://localhost:8000");
// });
