const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "readme.txt"), (err, data) => {
  if (err) {
    // console.log(err);
    throw err;
  }
  console.log(data.toString());
});

// 동기는 왠만하면 서버 시작 전에만 작성하도록 하자
// 아래는 백준에서 많이 본 코드 ㅋㅋㅋㅋ
const input = fs.readFileSync(path.join(__dirname, "readme.txt"));
console.log(input.toString());
