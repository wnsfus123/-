import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function EventPage() {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uuid = urlParams.get('key');
    console.log(uuid);

    axios
      .get(`/api/events/${uuid}`)
      .then((response) => {
        setEventData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  if (!eventData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img src="public/logo.png" alt="모일까 로고" className="logo" />
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
        <p>Start Day: {eventData.day}</p>
        <p>End Day: {eventData.time}</p>
      </main>

      <footer className="footer">
        <p>© 2024 모일까. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EventPage;
