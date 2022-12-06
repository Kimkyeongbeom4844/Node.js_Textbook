const path = require("path");

// 상대경로는 현재 파일 기준, 절대경로는 루트 폴더 기준
// join은 전부다 상대경로 처리하지만, resolve는 /를 만나면 절대경로로 처리하여 앞에 인자들을 전부 무시

console.log(path.join(__dirname, "./ccc"));
console.log(path.join(__dirname, "/ccc"));
console.log(path.join(__dirname, "ccc"));
console.log("-----");
console.log(path.resolve(__dirname, "./ccc"));
console.log(path.resolve(__dirname, "/ccc"));
console.log(path.resolve(__dirname, "ccc"));
console.log("-----");
console.log(path.join(__dirname, "../", "./ccc"));
console.log(path.join(__dirname, "../", "/ccc"));
console.log(path.join(__dirname, "../", "ccc"));
console.log("-----");
console.log(path.resolve(__dirname, "../", "./ccc"));
console.log(path.resolve(__dirname, "../", "/ccc"));
console.log(path.resolve(__dirname, "../", "ccc"));
