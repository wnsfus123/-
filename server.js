const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const app = express();
const http = require('http').createServer(app);
const uuid = require('uuid'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mysql'
});
// 서버의 시간대를 한국 시간대로 설정

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

http.listen(8080, () => {
  console.log("Listening on http://localhost:8080/");
});

app.use(express.static(path.join(__dirname, '/build')));



app.post("/api/events", (req, res) => {
  const { eventName, startDay, endDay, startTime, endTime } = req.body;

  const eventUUID = generateUUID();

  // 각 날짜 및 시간을 결합하여 datetime 형식으로 변환
  const startDateTime = moment(`${startDay} ${startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
  const endDateTime = moment(`${endDay} ${endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

  // 이벤트 데이터 생성
  const eventData = {
      uuid: eventUUID,
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
      console.log('UUID:', eventUUID);
      console.log('Event Name:', eventName);
      console.log('Start Date Time:', startDateTime);
      console.log('End Date Time:', endDateTime);

      // 응답 전송
      res.status(200).send('Event added successfully');
  });
});

app.get("/api/events/:uuid", (req, res) => {
  const { uuid } = req.params;

  // 데이터베이스에서 해당 UUID에 해당하는 이벤트를 가져옴
  connection.query("SELECT * FROM test WHERE uuid = ?", [uuid], (error, results, fields) => {
    if (error) {
      console.error("Error fetching event:", error);
      res.status(500).send("Error fetching event");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Event not found");
      return;
    }

    const eventData = results[0];
    res.status(200).json({
      uuid: eventUUID,
      eventname: eventName,
      day: startDateTime,
      time: endDateTime
    });
  });
});



function generateUUID() {
  return uuid.v4().slice(0, 6); // UUID 생성 후 앞 6글자 반환
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});