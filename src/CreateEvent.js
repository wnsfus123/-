import React from "react";
import "./App.css";
import { ConfigProvider, DatePicker, TimePicker, Button, Form, Input } from "antd";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리에서 v4 함수를 가져옴
import koKR from 'antd/lib/locale/ko_KR';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

dayjs.locale('ko');

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      startTime: null,
      endTime: null,
      selectedDates: [],
    };
    // this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    // this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  // handleStartTimeChange(time) {
  //   this.setState({ startTime: time });
  // }

  // handleEndTimeChange(time) {
  //   this.setState({ endTime: time });
  // }

  handleEventNameChange(event) {
    this.setState({ eventName: event.target.value });
  }

  handleConfirm() {
    const { startTime, endTime, selectedDates, eventName } = this.state;

    // 최소한 두 개 이상의 날짜가 선택되었는지 확인
    if (selectedDates.length < 2) {
      console.error("At least two dates should be selected");
      return;
    }

    // 첫 번째와 두 번째 날짜 선택
    const startDay = selectedDates[0];
    const endDay = selectedDates[1];

    // 시작 및 종료 시간 문자열 생성
    const startTimeStr = startTime.format("HH:mm");
    const endTimeStr = endTime.format("HH:mm");

    // 8자리 UUID 생성
    const eventUUID = uuidv4().substring(0, 8);

    // 클라이언트의 시간대로 변환하여 서버로 전송
    const startDayLocal = startDay.format("YYYY-MM-DD");
    const endDayLocal = endDay.format("YYYY-MM-DD");

    // 시작일과 종료일을 서버로 전송
    axios
      .post("/api/events", {
        uuid: eventUUID,
        eventName: eventName,
        startDay: startDayLocal,
        endDay: endDayLocal,
        startTime: startTimeStr,
        endTime: endTimeStr,
      })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.href = `http://localhost:8080/test/?key=${eventUUID}`;
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log("Event UUID:", eventUUID);
    console.log("Event Name:", eventName);
    console.log("Start Day:", startDay);
    console.log("End Day:", endDay);
    console.log("Selected Start Time:", startTimeStr);
    console.log("Selected End Time:", endTimeStr);
  }

  render() {
    return (
      <div className="App">
        {/* <Header /> */}
          <main className="main-content">
            <h1 style={{ textAlign: "center" }}>이벤트 생성란</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ textAlign: "center" }}>이벤트 이름</h3>
              <Form.Item
                //label={<p style={{ fontSize: "20px", textAlign: "center" }}>이벤트 이름</p>}
                name="eventName"
                rules={[{ required: true, message: "이벤트 이름을 입력해주세요" }]}
                style={{ width: "550px", height: "30px", fontSize: "20px" }}
              >
                <Input 
                onChange={this.handleEventNameChange} 
                style={{ height: "40px", width: "100%", marginBottom: "10px" }} 
                placeholder="이벤트 이름을 입력해주세요." 
                size={"large"}
                />
              </Form.Item>
              <ConfigProvider locale={koKR}>
                  <DatePicker.RangePicker
                    style={{width: "550px", marginBottom: '20px' }}
                    format="YYYY년 MM월 DD일"
                    onChange={(dates) => {
                      this.setState({ selectedDates: dates });
                    }}
                    placeholder={['시작 날짜', '종료 날짜']}
                    size={"large"}
                  />
                  <TimePicker.RangePicker
                    style={{width: "550px", marginBottom: '20px',  fontSize: '16px' }}
                    format="HH시 mm분"
                    onChange={(times) => {
                      this.setState({ startTime: times[0], endTime: times[1] });
                    }}
                    placeholder={['시작 시간', '종료 시간']}
                    minuteStep={60}
                    size={"large"}
                    picker={{
                      style: { width: "150px", height: "70px", fontSize: "20px", marginBottom: '20px' },
                    }}
                  />
                </ConfigProvider>


              <Form.Item style={{ width: "100%", textAlign: "center" }}>
              <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleConfirm}
                  disabled={
                    !this.state.selectedDates.length ||
                    !this.state.startTime ||
                    !this.state.endTime ||
                    !this.state.eventName
                  }
                  style={{ width: "400px", height: "45px", fontSize: "14px" }}
                >
                  확인
                </Button>
                </Form.Item>

            </div>
          </main>

        {/* <Footer/> */}
      </div>
    );
  }
}

export default CreateEvent;
