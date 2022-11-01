const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
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

app
  .route("/")
  .get((req, res) => {
    const refresh = jwt.sign({}, process.env.PRIVATE_KEY, {
      algorithm: "HS256",
      expiresIn: "14d",
    });

    jwt.sign(
      { id: "xops09685" },
      process.env.PRIVATE_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.send(err);
        }
        result = {
          access_token: token,
          refresh_token: refresh,
        };
        return res.json(result);
      }
    );
  })
  .post((req, res) => {
    db.query(
      `insert into users (name,age,married) values('${req.body.name}',${
        req.body.age
      },${req.body.married == undefined ? 0 : req.body.married});`,
      (err, ok) => {
        if (err) {
          console.error(err);
          return res.send("유저등록실패");
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

app.route("/login").post((req, res) => {
  console.log(req.body.access_token);
  jwt.verify(
    req.body.access_token,
    process.env.PRIVATE_KEY,
    { algorithms: "HS256" },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      console.log(result);
      return res.send(result);
    }
  );
});

app.route("/refresh").post((req, res) => {
  console.log(req.body.refresh_token);
  jwt.verify(
    req.body.refresh_token,
    process.env.PRIVATE_KEY,
    { algorithms: "HS256" },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      console.log(result.exp);
      return res.send(result);
    }
  );
});

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `app is running on http://${process.env.HOST}:${process.env.PORT}`
  );
});
