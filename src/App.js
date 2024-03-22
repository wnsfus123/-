import React from 'react';
import ScheduleSelector from 'react-schedule-selector';
import './App.css'; // 스타일 파일 임포트

class App extends React.Component {
 constructor(props) {
    super(props);
    this.state = { schedule: [] };
    this.handleChange = this.handleChange.bind(this);
    this.renderCustomDateCell = this.renderCustomDateCell.bind(this);
 }

 handleChange(newSchedule) {
    this.setState({ schedule: newSchedule });
 }

 renderCustomDateCell(time, selected, innerRef) {
    return (
      <div style={{ textAlign: 'center' }} ref={innerRef}>
        {selected ? '✅' : '❌'}
      </div>
    );
 }

 render() {
    return (
      <div className="App">
        <header className="header">
          <div className="logo-container">
            <img src="logo.png" alt="모일까 로고" className="logo"/>
          </div>
          <div className="nav-buttons">
            <button>로그인</button>
            <button>회원가입</button>
          </div>
        </header>

        <main className="main-content">
          <h1>Availability Selector</h1>
          <ScheduleSelector
            selection={this.state.schedule}
            numDays={3}
            minTime={8}
            maxTime={22}
            startDate={new Date('Fri May 18 2018 17:57:06 GMT-0700 (PDT)')}
            dateFormat="ddd M/D"
            renderDateCell={this.renderCustomDateCell}
            onChange={this.handleChange}
          />
        </main>

        <footer className="footer">
          <p>© 2024 모일까. All rights reserved.</p>
        </footer>
      </div>
    );
 }
}

export default App;