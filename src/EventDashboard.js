// EventDashboard.js
import React from 'react';
import ExistingEvents from './Components/ExistingEvents'; // 기존 일정 보기 컴포넌트 불러오기
import { getUserInfoFromLocalStorage } from './Components/authUtils';
import { Button } from 'antd';

const EventDashboard = () => {
  const userInfo = getUserInfoFromLocalStorage(); // 로컬 스토리지에서 사용자 정보 가져오기

  const handleCreateEvent = () => {
    window.location.href = 'http://localhost:8080/create'; // CreateEvent 페이지로 이동
  };

  return (
    <div>
      <h1>이벤트 대시보드</h1>
      <ExistingEvents userInfo={userInfo} /> {/* 기존 일정 보기 */}
      <Button type="primary" onClick={handleCreateEvent} style={{ marginTop: '20px' }}>
        이벤트 생성
      </Button> {/* 이벤트 생성 버튼 */}
    </div>
  );
};

export default EventDashboard;
