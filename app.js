const http = require('http');
const fs = require('fs');

http.createServer((req,res)=>{
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, {'set-cookie':'mycookie=test'});
    res.end('Hello cookie');
}).listen(8080,()=>{console.log('http://localhost:8080 is running')});
