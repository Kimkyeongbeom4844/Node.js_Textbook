const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");
const sign = require("./routers/sign");
const cookie = require("./routers/cookie");

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

const app = express();

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

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `app is running on http://${process.env.HOST}:${process.env.PORT}`
  );
});
