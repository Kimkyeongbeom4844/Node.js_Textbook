const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();
dotenv.config();

console.log(process.env.DATABASE_USERNAME || "ROOT");

app.use(morgan("short"));

app.get("/", function (req, res) {
  res.send("hello, world!");
});

app.listen(3000, () => console.log("http://localhost:3000"));
