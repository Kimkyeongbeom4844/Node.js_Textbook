const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
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
});

router.route("/login").post((req, res) => {
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

module.exports = router;

// router.route("/refresh").post((req, res) => {
//   console.log(req.body.refresh_token);
//   jwt.verify(
//     req.body.refresh_token,
//     process.env.PRIVATE_KEY,
//     { algorithms: "HS256" },
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.send(err);
//       }
//       console.log(result.exp);
//       return res.send(result);
//     }
//   );
// });
