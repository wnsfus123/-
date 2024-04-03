import React from "react";
import "./App.css"; 
import { DatePicker, TimePicker, Button, Form, Input } from 'antd'; 
import axios from 'axios';

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

    selectedDates.forEach(selectedDateStr => {
      const day = selectedDateStr;
      const startTimeStr = startTime.format('HH:mm');
      const endTimeStr = endTime.format('HH:mm');

      axios.post('/api/events', {
        eventName: eventName,
        day: day,
        time: startTimeStr,
      })
      .then(response => {
        console.log('Data sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });

      console.log('Event Name:', eventName);
      console.log('Selected Date:', selectedDateStr);
      console.log('Selected Start Time:', startTimeStr);
      console.log('Selected End Time:', endTimeStr);
      console.log('');
    });
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