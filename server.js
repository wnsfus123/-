const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const axios = require('axios'); // axios 라이브러리 임포트

// 8080번 포트에서 서버를 실행
http.listen(8080, () => {
  console.log("Listening on http://localhost:8080/");
});

app.use(express.static(path.join(__dirname, '/build')));

// 메인페이지 접속 시 build 폴더의 index.html 보내기
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

// POST 요청 처리
app.post('/api/saveDateTime', (req, res) => {
  // 여기에 POST 요청을 처리하는 코드 작성
  // 예시로 Axios를 사용하여 POST 요청을 다른 서버로 전송하는 코드를 작성하겠습니다.
  axios.post('http://localhost:8080/api/saveDateTime', {
    // 여기에 전송할 데이터를 넣어주세요
  })
  .then(response => {
    console.log('Data saved successfully:', response.data);
    res.status(200).send('Data saved successfully');
  })
  .catch(error => {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  });
});