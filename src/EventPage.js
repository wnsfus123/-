import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Button } from "antd";
import ScheduleSelector from "react-schedule-selector";
import Header from "./Components/MoHeader";


function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]); // 선택된 시간을 배열로 관리합니다.
  const [schedule, setSchedule] = useState([]);
  const [numDays, setNumDays] = useState(1); 

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uuid = urlParams.get("key");

    axios
      .get(`/api/events/${uuid}`)
      .then((response) => {
        setEventData(response.data);
        const startDate = moment(response.data.day);
        const endDate = moment(response.data.time);
        const diffDays = endDate.diff(startDate, "days") + 1;
        setNumDays(diffDays);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  const handleConfirm = () => {
    // 선택된 시간을 서버로 보내어 데이터베이스에 저장합니다.
    Object.entries(selectedTime).forEach(([date, times]) => {
      times.forEach((time) => {
        const datetime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").format();
        const requestData = {         
          event_name: eventData.eventname,
          event_uuid: eventData.uuid,
          event_datetime: datetime
        };
        axios.post("/api/save-event-schedule", requestData)
          .then((response) => {
            console.log("Event schedule saved successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error saving event schedule:", error);
          });
      });
    });
  };

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
    // 선택된 시간을 각 날짜별로 묶어서 저장합니다.
    const selectedTimeByDate = {};
    newSchedule.forEach((time) => {
      const date = moment(time).format("YYYY-MM-DD");
      if (!selectedTimeByDate[date]) {
        selectedTimeByDate[date] = [];
      }
      selectedTimeByDate[date].push(moment(time).format("HH:mm"));
    });
    setSelectedTime(selectedTimeByDate);
  };

  const handleLogin = () => {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
  
    if (!username.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
  
    // 로그인 처리 코드 작성
    const isLoggedIn = true; // 예시로 성공했다고 가정
  
    if (isLoggedIn) {
      alert("로그인 성공! 이벤트에 참여하세요.");
      // 추가 작업
    } else {
      alert("로그인 실패. 아이디와 비밀번호를 확인해주세요.");
    }
  };
  
   
  if (!eventData) {
    return <p>Loading...</p>;
  }

  const startDate = moment(eventData.day).format("YYYY-MM-DD");
  const endDate = moment(eventData.time).format("YYYY-MM-DD");
  const startTime = moment(eventData.day).format("HH:mm");
  const endTime = moment(eventData.time).format("HH:mm");
  const Schedule_Start = moment(eventData.day).toDate();
  const Schedule_End = moment(eventData.time).toDate();

  return (
    <div className="App">
    <div className="login-form">
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <Button type="primary" onClick={handleLogin}> 로그인 </Button>         
    </div>

      <main className="main-content">   
        <h1>Event Details</h1>
        <h2>Event Name: {eventData.eventname}</h2>
        <h2>Event UUID: {eventData.uuid}</h2>
        <p>Start Day: {startDate}</p>
        <p>End Day: {endDate}</p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        <ScheduleSelector
          selection={schedule}
          numDays={numDays}
          startDate={Schedule_Start}
          endDate={Schedule_End}
          minTime={moment(startTime, "HH:mm").hours()}
          maxTime={moment(endTime, "HH:mm").hours()}
          hourlyChunks={2}
          rowGap="0px"
          onChange={handleScheduleChange}
          renderTimeLabel={(time) => {
            const formattedStartTime = moment(time).format("HH:mm");
            const formattedEndTime = moment(time).add(30, "minutes").format("HH:mm");
            return <div>{formattedStartTime} - {formattedEndTime}</div>;
          }}
        />
        <Button type="primary" onClick={handleConfirm}>
          Confirm
        </Button>
        {/* 선택된 시간을 날짜와 시간으로 표시합니다. */}
        {Object.entries(selectedTime).map(([date, times]) => (
          <div key={date}>
            {times.map((time) => (
              <p key={time}>{date} {time}</p>
            ))}
          </div>
        ))}
      </main>

      <footer className="footer">
        <p>© 2024 모일까. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EventPage;