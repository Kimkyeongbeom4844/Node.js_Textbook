const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();
router.use(cookieParser(process.env.PRIVATE_KEY));

router
  .route("/")
  .get((req, res) => {
    console.log("send cookie to cli");
    res.cookie("cookie_name", "qwer1234zxcvasdf", {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
      signed: true,
      // secure: true,
    });
    return res.status(200).end();
  })
  .post((req, res) => {
    if (!req.signedCookies.cookie_name) {
      return res.json({ message: "no cookie in application" });
    }
    console.log(req.signedCookies);
    res.clearCookie("cookie_name");
    return res.json({ message: "send cookie to server" });
  });

module.exports = router;
