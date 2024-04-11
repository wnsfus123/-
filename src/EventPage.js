import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Button } from "antd";
import ScheduleSelector from "react-schedule-selector";

function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uuid = urlParams.get("key");

    axios
      .get(`/api/events/${uuid}`)
      .then((response) => {
        setEventData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  const handleConfirm = () => {
    // 선택된 시작 시간과 끝 시간을 콘솔에 출력합니다.
    console.log("Selected Start Time:", selectedStartTime);
    console.log("Selected End Time:", selectedEndTime);

    // 이후에는 선택된 시간을 서버로 보내서 처리할 수 있습니다.
  };

  if (!eventData) {
    return <p>Loading...</p>;
  }

  const startDate = moment(eventData.day).format("YYYY-MM-DD");
  const endDate = moment(eventData.time).format("YYYY-MM-DD");
  const startTime = moment(eventData.day).format("HH:mm");
  const endTime = moment(eventData.time).format("HH:mm");

  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="모일까 로고" className="logo" />
        </div>
        <div className="nav-buttons">
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </header>

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
          numDays={3}
          minTime={moment(startTime, "HH:mm").hours()}
          maxTime={moment(endTime, "HH:mm").hours()}
          onChange={(newSchedule) => {
            setSchedule(newSchedule);
            setSelectedStartTime(newSchedule.length > 0 ? newSchedule[0] : null);
            setSelectedEndTime(newSchedule.length > 0 ? newSchedule[newSchedule.length - 1] + 1 : null);
          }}
        />
        <Button type="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </main>

      <footer className="footer">
        <p>© 2024 모일까. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EventPage;
