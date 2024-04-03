import React from "react";
import "./App.css"; 
import { DatePicker, TimePicker, Button, Form, Input } from 'antd'; 
import axios from 'axios';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      startTime: null,
      endTime: null,
      selectedDates: [],
    };
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleEventNameChange = this.handleEventNameChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleStartTimeChange(time) {
    this.setState({ startTime: time });
  }

  handleEndTimeChange(time) {
    this.setState({ endTime: time });
  }

  handleEventNameChange(event) {
    this.setState({ eventName: event.target.value });
  }

  handleConfirm() {
    const { startTime, endTime, selectedDates, eventName } = this.state;

    // 최소한 두 개 이상의 날짜가 선택되었는지 확인
    if (selectedDates.length < 2) {
        console.error('At least two dates should be selected');
        return;
    }

    // 첫 번째와 두 번째 날짜 선택
    const startDay = selectedDates[0];
    const endDay = selectedDates[1];
    
    // 시작 및 종료 시간 문자열 생성
    const startTimeStr = startTime.format('HH:mm');
    const endTimeStr = endTime.format('HH:mm');
    // 클라이언트의 시간대로 변환하여 서버로 전송
    const startDayLocal = startDay.format('YYYY-MM-DD');
    const endDayLocal = endDay.format('YYYY-MM-DD');

    // 시작일과 종료일을 서버로 전송
    axios.post('/api/events', {
        eventName: eventName,
        startDay: startDayLocal,
        endDay: endDayLocal,
        startTime: startTimeStr,
        endTime: endTimeStr,
    })
    .then(response => {
        console.log('Data sent successfully:', response.data);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });

    console.log('Event Name:', eventName);
    console.log('Start Day:', startDay);
    console.log('End Day:', endDay);
    console.log('Selected Start Time:', startTimeStr);
    console.log('Selected End Time:', endTimeStr);
}

  render() {
    return (
      <div className="App">
        <main className="main-content">
          <h1>Availability Selector</h1>
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: "Please input an event name" }]}
          >
            <Input onChange={this.handleEventNameChange}/>
          </Form.Item>
          <div className="date-time-picker">
            <DatePicker.RangePicker 
              format="YYYY-MM-DD" 
              onChange={(dates) => {     
                this.setState({ selectedDates: dates });
              }}
            />
            <TimePicker 
              format="HH:mm" 
              onChange={this.handleStartTimeChange} 
              placeholder="Start Time" 
            />
            <TimePicker 
              format="HH:mm" 
              onChange={this.handleEndTimeChange} 
              placeholder="End Time" 
            />
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                onClick={this.handleConfirm}
                disabled={!this.state.selectedDates.length || !this.state.startTime || !this.state.endTime || !this.state.eventName}
              >
                Confirm
              </Button>
            </Form.Item>
          </div>
        </main>
      </div>
    );
  }
}

export default App;