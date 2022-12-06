const fs = require("fs");
const path = require("path");

const readFile = fs.createReadStream(path.join(__dirname, "readme.txt"), {
  highWaterMark: 10, //10 바이트 씩 잘라 보내줌
});

const arr = [];
readFile.on("data", (data) => {
  console.log(data, data.length);
  arr.push(data);
});
readFile.on("end", () => {
  console.log(arr);
  console.log("end : ", Buffer.concat(arr));
});
readFile.on("error", (err) => {
  console.log(err);
});

const createFile = fs.createWriteStream(path.join(__dirname, "yummy.txt"));

createFile.on("finish", () => {
  console.log("finish");
});
createFile.write(`Assert TV
야미 ㅎㅎ `);
createFile.write(`kg받쥬~dd`);
createFile.write(`kg받쥬~dd`);
createFile.write(`kg받쥬~dd`);
createFile.write(`kg받쥬~dd`);
createFile.write(`kg받쥬~dd`);

createFile.end();
