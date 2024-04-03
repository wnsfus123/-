const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const app = express();
const http = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mysql'
});
// 서버의 시간대를 한국 시간대로 설정
moment.tz.setDefault('Asia/Seoul');
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

http.listen(3000, () => {
  console.log("Listening on http://localhost:8080/");
});

app.use(express.static(path.join(__dirname, '/build')));



app.post("/api/events", (req, res) => {
  const { eventName, startDay, endDay, startTime, endTime } = req.body;

  // 각 날짜 및 시간을 결합하여 datetime 형식으로 변환
  const startDateTime = moment(`${startDay} ${startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
  const endDateTime = moment(`${endDay} ${endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

  // 이벤트 데이터 생성
  const eventData = {
      eventname: eventName,
      day: startDateTime,
      time: endDateTime
  };

  // 데이터베이스에 이벤트 추가
  connection.query('INSERT INTO test SET ?', eventData, (error, results, fields) => {
      if (error) {
          console.error('Error inserting event:', error);
          res.status(500).send('Error inserting event');
          return;
      }

      console.log('Event added successfully');
      console.log('Event Name:', eventName);
      console.log('Start Date Time:', startDateTime);
      console.log('End Date Time:', endDateTime);

      // 응답 전송
      res.status(200).send('Event added successfully');
  });
});



function generateUUID() {
  // Implement your UUID generation logic here
  // For simplicity, you can use libraries like 'uuid' or generate a UUID manually
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});