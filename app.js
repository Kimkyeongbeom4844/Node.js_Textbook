const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");
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
    return res.send(req.method);
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
        return res.send("유저등록성공");
      }
    );
  });

app.route("/:id").get((req, res) => {
  console.log(req.params.id);
  db.query(`select * from users where id=${req.params.id};`, (err, ok) => {
    if (err) {
      console.error(err);
      return res.send("유저 정보가 없습니다.");
    }
    console.log("유저가 있습니다.");
    return res.send(ok[0]);
  });
});

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `app is running on http://${process.env.HOST}:${process.env.PORT}`
  );
});