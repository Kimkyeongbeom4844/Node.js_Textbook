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
    res.cookie("room_id", "4", {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
      signed: true,
      // secure: true,
    });
    return res.status(200).end();
  })
  .post((req, res) => {
    if (!req.signedCookies.room_id) {
      return res.json({ message: "서명된 쿠키가 변조되었거나 없습니다." });
    }
    console.log(req.signedCookies);
    res.clearCookie("room_id");
    return res.json({ message: "서명된 쿠키가 전송되었습니다." });
  });

module.exports = router;
