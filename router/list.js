const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
});

// db.connect((err) => {
//   if (err) console.error(err);
//   console.log("db연결성공");
// });

router
  .route("/")
  .get((req, res) => {
    db.query(`select * from todolist;`, (err, ok) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(ok);
    });
  })
  .post((req, res) => {
    console.log(req.body);
    db.query(
      `insert into todolist (content) values('${req.body.content}');`,
      (err, ok) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        return res.json({ message: ok.insertId });
      }
    );
  });

router
  .route("/:id")
  .get((req, res) => {
    console.log(req.params.id);
    db.query(`select * from todolist where id=${req.params.id}`, (err, ok) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      ok.length !== 0 ? res.json(ok) : res.json({ message: "유저가 없습니다" });
    });
  })
  .patch((req, res) => {
    db.query(
      `update todolist set complete=${req.body.complete} where id=${req.params.id}`,
      (err, ok) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        return res.json({
          contentId: req.params.id,
          complete: req.body.complete,
        });
      }
    );
  })
  .delete((req, res) => {
    console.log(req.params.id);
    db.query(`delete from todolist where id=${req.params.id}`, (err, ok) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json({ contentId: req.params.id });
    });
  });

module.exports = router;
