import React from "react";
import ScheduleSelector from "react-schedule-selector";
import "./App.css"; // 스타일 파일 임포트
import { DatePicker, TimePicker, Button } from 'antd'; // DatePicker, TimePicker 및 Button import 추가
import axios from 'axios'; // axios 라이브러리 임포트
import moment from "moment"; // moment 라이브러리 임포트

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: [],
      startTime: null,
      endTime: null,
      selectedDates: [], // 클라이언트에서 선택한 날짜를 저장하는 상태 변경
      startDate: null,
      endDate: null,
      datesToDisplay: [], // 선택한 날짜들 사이에 있는 날짜들을 배열로 저장함 
      isDateSelected: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this); // DatePicker의 선택한 날짜를 처리하는 핸들러 추가
    this.handleConfirm = this.handleConfirm.bind(this); // Confirm 버튼 클릭 핸들러 추가
    this.renderCustomDateCell = this.renderCustomDateCell.bind(this);
  }

  handleChange(newSchedule) {
    this.setState({ schedule: newSchedule });
  }

  handleStartTimeChange(time) {
    this.setState({ startTime: time });
  }

  handleEndTimeChange(time) {
    this.setState({ endTime: time });
  }

  handleDateChange(dates) {
    this.setState({ selectedDates: dates }); // 선택한 날짜를 상태에 저장
  }

  handleConfirm() {
    const { startTime, endTime, datesToDisplay } = this.state;
  
    datesToDisplay.forEach(selectedDateStr => {
      const startTimeStr = startTime.format('HH:mm');
      const endTimeStr = endTime.format('HH:mm');
  
      // 서버로 데이터를 전송
      axios.post('http://localhost:8080/api/saveDateTime', {
        selectedDate: selectedDateStr,
        startTime: startTimeStr,
        endTime: endTimeStr
      })
      .then(response => {
        console.log('Data sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  
      // 선택한 날짜, 시작 시간, 종료 시간을 콘솔에 출력
      console.log('Selected Date:', selectedDateStr);
      console.log('Selected Start Time:', startTimeStr);
      console.log('Selected End Time:', endTimeStr);
      console.log(''); // 각 날짜의 정보 사이에 새 줄 추가
    });
  }
  

  renderCustomDateCell(time, selected, innerRef) {
    return (
      <div style={{ textAlign: "center" }} ref={innerRef}>
        {selected ? "✅" : "❌"}
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="logo-container">
            <img src="logo.png" alt="모일까 로고" className="logo" />
          </div>
          <div className="nav-buttons">
            <button>로그인</button>
            <button>회원가입</button>
          </div>
        </header>

        <main className="main-content">
          <h1>Availability Selector</h1>
          <div className="date-time-picker">
            <DatePicker.RangePicker 
              format="YYYY-MM-DD" 
              onChange={(dates) => {     // 선택한 날짜들과 날짜들 사이에 있는 날짜를 상태에 저장
                this.setState({
                  startDate: dates[0],
                  endDate: dates[1],
                  isDateSelected: true
                });

                // 표시할 날짜 계산
                const datesToDisplay = [];
                const currentDate = new Date(dates[0]);
                const endDate = new Date(dates[1]);
                while (currentDate <= endDate) {
                  datesToDisplay.push(currentDate.toLocaleDateString('en-US'));
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                this.setState({ datesToDisplay: datesToDisplay });

                // 콘솔에 날짜 기록
                console.log(datesToDisplay);
              }}
            />
            <TimePicker 
              format="HH:mm" 
              onChange={this.handleStartTimeChange} 
              value={this.state.startTime} 
              placeholder="Start Time" 
            />
            <TimePicker 
              format="HH:mm" 
              onChange={this.handleEndTimeChange} 
              value={this.state.endTime} 
              placeholder="End Time" 
            />
            <Button 
              type="primary" 
              onClick={this.handleConfirm} // Confirm 버튼 클릭 시 핸들러 실행
              disabled={!this.state.isDateSelected} // 날짜가 선택될 때까지 Confirm 버튼 사용 안함
            >
              Confirm
            </Button>
          </div>
          {this.state.isDateSelected && (
            <ScheduleSelector
              selection={this.state.schedule}
              numDays={3}
              minTime={8}
              maxTime={22}
              startDate={this.state.startDate}
              dateFormat="ddd M/D"
              renderDateCell={this.renderCustomDateCell}
              onChange={this.handleChange}
            />
          )}
        </main>

        <footer className="footer">
          <p>© 2024 모일까. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default App;
