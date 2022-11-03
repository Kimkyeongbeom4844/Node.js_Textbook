const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router
  .route("/")
  .get((req, res) => {
    jwt.sign(
      { id: "0000", pw: "1111" },
      process.env.PRIVATE_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        return self.send(token);
      }
    );
  })
  .post((req, res) => {
    jwt.verify(
      req.body,
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

module.exports = router;
