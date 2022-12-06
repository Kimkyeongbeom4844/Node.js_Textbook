const fs = require("fs").promises;
const path = require("path");

fs.readFile(path.join(__dirname, "readme.txt"))
  .then((data) => {
    // console.log(data.toString());
    console.log("1번");
    return fs.readFile(path.join(__dirname, "readme.txt"));
  })
  .then((data) => {
    console.log("2번");
    return fs.readFile(path.join(__dirname, "readme.txt"));
  })
  .then((data) => {
    console.log("3번");
    return fs.readFile(path.join(__dirname, "readme.txt"));
  });
