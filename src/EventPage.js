import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Button } from "antd";
import ScheduleSelector from "react-schedule-selector";
import Header from "./Components/MoHeader";

function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
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
        const startDate = moment(response.data.startday);
        const endDate = moment(response.data.endday);
        const diffDays = endDate.diff(startDate, "days") + 1;
        setNumDays(diffDays);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  const handleConfirm = () => {
    
    Object.entries(selectedTime).forEach(([date, times]) => {
      times.forEach((time) => {
        const datetime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").format();
        
        const requestData = {
          kakaoId: eventData.kakaoId,
          nickname: eventData.nickname,
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

  if (!eventData) {
    return <p>Loading...</p>;
  }

  const startDate = moment(eventData.startday).format("YYYY-MM-DD");
  const endDate = moment(eventData.endday).format("YYYY-MM-DD");
  const startTime = moment(eventData.startday).format("HH:mm");
  const endTime = moment(eventData.endday).format("HH:mm");
  const Schedule_Start = moment(eventData.startday).toDate();
  const Schedule_End = moment(eventData.endday).toDate();

  return (
    <div className="App">
      <main className="main-content">
        <h1>Event Details</h1>
        <h2>Event Name: {eventData.eventname}</h2>
        <h2>Event UUID: {eventData.uuid}</h2>
        <p>Start Day: {startDate}</p>
        <p>End Day: {endDate}</p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        
        <div style={{ display: 'inline-flex', alignItems: 'stretch', width: '1500px' }}>
          <div style={{ flex: '1', marginRight: '20px', overflowX: "scroll" }}>
            <ScheduleSelector
              selection={schedule}
              numDays={numDays}
              startDate={Schedule_Start}
              endDate={Schedule_End}
              minTime={moment(startTime, "HH:mm").hours()}
              maxTime={moment(endTime, "HH:mm").hours()}
              hourlyChunks={2}
              rowGap="4px"
              columnGap="7px"
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
          </div>

          <div style={{ flex: '1' }}>
            <h1>TEST AREA</h1>
            {Object.entries(selectedTime).map(([date, times]) => (
              <div key={date}>
                {times.map((time) => (
                  <p key={time}>{date} {time}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventPage;
