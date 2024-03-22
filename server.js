// 라이브러리 불러오기
const express = require('express');
const path = require('path');
const app = express();

const http = require('http').createServer(app);

// 8080번 포트에서 서버를 실행할거야
http.listen(8080, () => {
  // 서버가 정상적으로 실행되면 콘솔창에 이 메시지를 띄워줘
  console.log("Listening on http://localhost:8080/");
});

app.use(express.static(path.join(__dirname, '/build')));
app.get("/api", (req, res) => {
  res.json({ title: "Hello" });
});

// 메인페이지 접속 시 build 폴더의 index.html 보내줘
app.get('/', (res, req) => {
  req.sendFile(path.join(__dirname, '/build/index.html'));
})

