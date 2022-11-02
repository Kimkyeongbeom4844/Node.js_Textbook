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
    res.cookie("access_token", "액세스토큰값", {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
      signed: true,
    });
    return res.status(200).end();
  })
  .post((req, res) => {
    if (!req.signedCookies.access_token) {
      return res.json("쿠키가 없습니다");
    }
    console.log(req.signedCookies);
    res.clearCookie("access_token");
    return res.json("send cookie to server");
  });

module.exports = router;
