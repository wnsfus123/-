// EventPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { uuid } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/events/${uuid}`)
      .then((response) => {
        setEventData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, [uuid]);

  if (!eventData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Event Details</h1>
      <h2>Event Name: {eventData.eventName}</h2>
      <p>Start Day: {eventData.startDay}</p>
      <p>End Day: {eventData.endDay}</p>
      <p>Start Time: {eventData.startTime}</p>
      <p>End Time: {eventData.endTime}</p>
    </div>
  );
};

export default EventPage;
