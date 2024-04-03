const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
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
  const { eventName, day, time } = req.body;

  // 날짜와 시간 결합하여 datetime 형식으로 변환
  const eventDateTime = moment(`${day} ${time}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

  const eventData = {
    uuid: generateUUID(), // UUID 생성 로직
    eventname: eventName,
    day: eventDateTime
  };

  connection.query('INSERT INTO test SET ?', eventData, (error, results, fields) => {
    if (error) {
      console.error('Error inserting event:', error);
      res.status(500).send('Error inserting event');
      return;
    }
    console.log('Event added successfully');
    console.log('Event Name:', eventName);
    console.log('day:', eventDateTime);
    
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