import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Button, Card, Typography, Row, Col, message, Tooltip } from "antd";
import ScheduleSelector from "react-schedule-selector";
import Header from "./Components/MoHeader";
import './App.css';

const { Title, Text } = Typography;

function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [numDays, setNumDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allSchedules, setAllSchedules] = useState([]);
  const [userSchedules, setUserSchedules] = useState({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const uuid = urlParams.get("key");

        const response = await axios.get(`/api/events/${uuid}`);
        setEventData(response.data);

        const startDate = moment(response.data.startday);
        const endDate = moment(response.data.endday);
        const diffDays = endDate.diff(startDate, "days") + 1;
        setNumDays(diffDays);

        const schedulesResponse = await axios.get(`/api/event-schedules/${uuid}`);
        setAllSchedules(schedulesResponse.data);

        const userSchedulesMap = {};
        schedulesResponse.data.forEach(schedule => {
          const time = moment(schedule.event_datetime).format("YYYY-MM-DD HH:mm");
          if (!userSchedulesMap[time]) {
            userSchedulesMap[time] = [];
          }
          userSchedulesMap[time].push(schedule.nickname);
        });
        setUserSchedules(userSchedulesMap);
      } catch (error) {
        console.error("Error fetching event data:", error);
        message.error("Error fetching event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  const handleConfirm = async () => {
    try {
      for (const [date, times] of Object.entries(selectedTime)) {
        for (const time of times) {
          const datetime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").format();

          const requestData = {
            kakaoId: eventData.kakaoId,
            nickname: eventData.nickname,
            event_name: eventData.eventname,
            event_uuid: eventData.uuid,
            event_datetime: datetime,
          };

          await axios.post("/api/save-event-schedule", requestData);
        }
      }
      message.success("Event schedule saved successfully");
    } catch (error) {
      console.error("Error saving event schedule:", error);
      message.error("Error saving event schedule");
    }
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!eventData) {
    return <p>No event data available</p>;
  }

  const startDate = moment(eventData.startday).format("YYYY-MM-DD");
  const endDate = moment(eventData.endday).format("YYYY-MM-DD");
  const startTime = moment(eventData.startday).format("HH:mm");
  const endTime = moment(eventData.endday).format("HH:mm");
  const Schedule_Start = moment(eventData.startday).toDate();
  const Schedule_End = moment(eventData.endday).toDate();

  const countOccurrences = (time) => {
    return allSchedules.filter(schedule => moment(schedule.event_datetime).isSame(time, 'minute')).length;
  };

  return (
    <div className="App">
      <main className="main-content">
        <Card style={{ margin: "20px", padding: "20px" }}>
          <Title level={2}>Event Details</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Event Name: </Text>
              <Text>{eventData.eventname}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Event UUID: </Text>
              <Text>{eventData.uuid}</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Start Day: </Text>
              <Text>{startDate}</Text>
            </Col>
            <Col span={12}>
              <Text strong>End Day: </Text>
              <Text>{endDate}</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Start Time: </Text>
              <Text>{startTime}</Text>
            </Col>
            <Col span={12}>
              <Text strong>End Time: </Text>
              <Text>{endTime}</Text>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card style={{ margin: "20px", padding: "20px", overflowX: "auto" }}>
              <Title level={3}>Select Schedule</Title>
              <div className="schedule-selector-wrapper">
                <ScheduleSelector
                  selection={schedule}
                  numDays={numDays}
                  startDate={Schedule_Start}
                  minTime={moment(startTime, "HH:mm").hours()}
                  maxTime={moment(endTime, "HH:mm").hours()}
                  hourlyChunks={2}
                  rowGap="4px"
                  columnGap="7px"
                  onChange={handleScheduleChange}
                  renderTimeLabel={(time) => {
                    const formattedStartTime = moment(time).format("HH:mm");
                    const formattedEndTime = moment(time).add(30, "minutes").format("HH:mm");
                    return <div className="time-label">{formattedStartTime} - {formattedEndTime}</div>;
                  }}
                />
              </div>
              <Button type="primary" onClick={handleConfirm} style={{ marginTop: "20px" }}>
                Confirm
              </Button>
            </Card>
          </Col>

          <Col span={12}>
            <Card style={{ margin: "20px", padding: "20px", overflowX: "auto" }}>
              <Title level={3}>Selected Times</Title>
              <div className="schedule-selector-wrapper">
                <ScheduleSelector
                  selection={schedule}
                  numDays={numDays}
                  startDate={Schedule_Start}
                  minTime={moment(startTime, "HH:mm").hours()}
                  maxTime={moment(endTime, "HH:mm").hours()}
                  hourlyChunks={2}
                  rowGap="4px"
                  columnGap="7px"
                  renderTimeLabel={(time) => {
                    const formattedStartTime = moment(time).format("HH:mm");
                    const formattedEndTime = moment(time).add(30, "minutes").format("HH:mm");
                    return <div className="time-label">{formattedStartTime} - {formattedEndTime}</div>;
                  }}
                  renderDateCell={(time, selected, innerRef) => {
                    const occurrences = countOccurrences(time);
                    const opacity = Math.min(0.1 + occurrences * 0.1, 1);
                    const formattedTime = moment(time).format("YYYY-MM-DD HH:mm");
                    const users = userSchedules[formattedTime] || [];
                    return (
                      <Tooltip title={users.join(", ")} placement="top">
                        <div
                          ref={innerRef}
                          style={{
                            backgroundColor: `rgba(0, 128, 0, ${opacity})`,
                            border: "1px solid #ccc",
                            height: "100%",
                            width: "100%",
                          }}
                        />
                      </Tooltip>
                    );
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
}

export default EventPage;
