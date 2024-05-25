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

connection.connect(err => {
  if (err) {
    console.error('MySQL 데이터베이스에 연결 중 오류 발생:', err.stack);
    return;
  }
  console.log('MySQL 데이터베이스에 연결되었습니다.');
});

http.listen(8080, () => {
  console.log("http://localhost:8080/ 에서 서비스를 시작합니다.");
});

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.post("/api/events", (req, res) => {
  const { uuid, eventName, startDay, endDay, startTime, endTime, kakaoId, nickname } = req.body;

  // 각 날짜 및 시간을 결합하여 datetime 형식으로 변환
  const startDateTime = moment(`${startDay} ${startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
  const endDateTime = moment(`${endDay} ${endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

  // 이벤트 데이터 생성
  const eventData = {
    uuid: uuid,
    eventname: eventName,
    startday: startDateTime,
    endday: endDateTime,
    kakaoId: kakaoId,
    nickname: nickname
  };

  // 데이터베이스에 이벤트 추가
  connection.query('INSERT INTO test SET ?', eventData, (error, results, fields) => {
    if (error) {
      console.error('이벤트 추가 중 오류 발생:', error);
      res.status(500).send('이벤트 추가 중 오류 발생');
      return;
    }

    console.log('이벤트가 성공적으로 추가되었습니다.');
    console.log('UUID:', uuid);
    console.log('이벤트 이름:', eventName);
    console.log('시작 일시:', startDateTime);
    console.log('종료 일시:', endDateTime);
    console.log('카카오 ID:', kakaoId);
    console.log('닉네임:', nickname);

    // 응답 전송
    res.status(200).send('이벤트가 성공적으로 추가되었습니다.');
  });
});

app.post("/api/save-event-schedule", (req, res) => {
  const { user_id, user_pw, event_name, event_uuid, event_datetime } = req.body;

  const eventData = {
    user_id: user_id,
    user_pw: user_pw,
    event_name: event_name,
    event_uuid: event_uuid,
    event_datetime: event_datetime
  };

  connection.query('INSERT INTO EventSchedule SET ?', eventData, (error, results, fields) => {
    if (error) {
      console.error('이벤트 스케줄 추가 중 오류 발생:', error);
      res.status(500).send('이벤트 스케줄 추가 중 오류 발생');
      return;
    }

    console.log('이벤트 스케줄이 성공적으로 추가되었습니다.');
    console.log('User ID:', user_id);
    console.log('User ID:', user_pw);
    console.log('이벤트 이름:', event_name);
    console.log('이벤트 UUID:', event_uuid);
    console.log('이벤트 일시:', event_datetime);

    res.status(200).send('이벤트 스케줄이 성공적으로 추가되었습니다.');
  });
});

app.get("/api/events/:uuid", (req, res) => {
  const { uuid } = req.params;

  // 데이터베이스에서 해당 UUID에 해당하는 이벤트를 가져옴
  connection.query("SELECT * FROM test WHERE uuid = ?", [uuid], (error, results, fields) => {
    if (error) {
      console.error("이벤트를 가져오는 중 오류 발생:", error);
      res.status(500).send("이벤트를 가져오는 중 오류 발생");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("해당 이벤트를 찾을 수 없습니다.");
      return;
    }

    const eventData = results[0];
    res.status(200).json({
      uuid: eventData.uuid,
      eventname: eventData.eventname,
      startday: eventData.startday,
      endday: eventData.endday,
      kakaoId: eventData.kakaoId,
      nickname: eventData.nickname
    });
  });
});

// 사용자 정보 express
app.post("/api/save-user-info", (req, res) => {
  const { kakaoId, nickname } = req.body;

  const userInfo = {
    user_id: kakaoId,
    nickname: nickname
  };

  // 사용자 정보 저장 로직
  connection.query('INSERT INTO users SET ?', userInfo, (error, results, fields) => {
    if (error) {
      console.error('사용자 정보 추가 중 오류 발생:', error);
      res.status(500).send('사용자 정보 추가 중 오류 발생');
      return;
    }

    console.log('사용자 정보가 성공적으로 추가되었습니다.');
    console.log('사용자 ID:', kakaoId);
    console.log('닉네임:', nickname);

    res.status(200).send('사용자 정보가 성공적으로 추가되었습니다.');
  });
});





app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});
