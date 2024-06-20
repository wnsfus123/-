import React, { useEffect, useState } from "react";
import { ConfigProvider, DatePicker, TimePicker, Button, Form, Input, Card } from "antd";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import koKR from 'antd/lib/locale/ko_KR';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import useUserStore from './store/userStore';
import moment from 'moment';
import Socialkakao from "./Components/Socialkakao";
dayjs.locale('ko');

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [uuid, setUuid] = useState(""); // UUID 상태 추가
  const userInfo = useUserStore(state => state.userInfo);
  const setUserInfo = useUserStore(state => state.setUserInfo);
  const clearUserInfo = useUserStore(state => state.clearUserInfo);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/check-login-status', { withCredentials: true });
        if (response.data.isLoggedIn) {
          setUserInfo(response.data.userInfo);
        } else {
          clearUserInfo();
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        clearUserInfo();
      }
    };

    checkLoginStatus();
  }, [setUserInfo, clearUserInfo]);

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  }

  const handleUuidChange = (event) => {
    setUuid(event.target.value); // UUID 변경 핸들러 추가
  }

  const handleConfirm = () => {
    if (!uuid) {
      console.error("UUID를 입력해주세요");
      return;
    }

    // zustand에서 가져온 아이디, 닉네임
    if (!userInfo) {
      console.error("로그인 정보가 없습니다.");
      return;
    }
    const kakaoId = userInfo.id.toString(); 
    const nickname = userInfo.kakao_account.profile.nickname; 

    window.location.href = `http://localhost:8080/test/?key=${uuid}&kakaoId=${kakaoId}&nickname=${nickname}`;

    console.log("UUID:", uuid);
    console.log("Your Id:", kakaoId);
    console.log("Your nickname:", nickname);
  }

  const handleCreateEvent = () => {
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

    // zustand에서 가져온 아이디, 닉네임
    if (!userInfo) {
      console.error("로그인 정보가 없습니다.");
      return;
    }
    const kakaoId = userInfo.id.toString(); 
    const nickname = userInfo.kakao_account.profile.nickname; 

    // 생성 날짜
    const createDay = moment().format("YYYY-MM-DD HH:mm:ss");

    // 시작일과 종료일을 서버로 전송
    axios
      .post("/api/events", {
        uuid: eventUUID,
        eventName: eventName,
        startDay: startDayLocal,
        endDay: endDayLocal,
        startTime: startTimeStr,
        endTime: endTimeStr,
        kakaoId: userInfo.id.toString(), // Zustand 스토어에서 가져온 카카오 ID
        nickname: userInfo.kakao_account.profile.nickname, // Zustand 스토어에서 가져온 닉네임
        createDay: createDay
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
    console.log("Your Id:", kakaoId);
    console.log("Your nickname:", nickname);
    console.log("Create Day:", createDay);
  }

  if (!userInfo) {
    return <Socialkakao/>;
  }

  return (
    <div className="App">
      <main className="main-content">
        <h1 style={{ textAlign: "center" }}>이벤트 생성란</h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Card title="이벤트 생성" style={{ width: 600, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ textAlign: "center" }}>이벤트 이름</h3>
              <Form.Item
                name="eventName"
                rules={[{ required: true, message: "이벤트 이름을 입력해주세요" }]}
                style={{ width: "550px", height: "30px", fontSize: "20px" }}
              >
                <Input 
                  onChange={handleEventNameChange} 
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
                    setSelectedDates(dates);
                  }}
                  placeholder={['시작 날짜', '종료 날짜']}
                  size={"large"}
                />
                <TimePicker.RangePicker
                  style={{width: "550px", marginBottom: '20px',  fontSize: '16px' }}
                  format="HH시 mm분"
                  onChange={(times) => {
                    setStartTime(times[0]);
                    setEndTime(times[1]);
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
                  onClick={handleCreateEvent}
                  disabled={
                    !selectedDates.length ||
                    !startTime ||
                    !endTime ||
                    !eventName
                  }
                  style={{ width: "400px", height: "45px", fontSize: "14px" }}
                >
                  이벤트 생성
                </Button>
              </Form.Item>
            </div>
          </Card>

          <Card title="UUID 입력" style={{ width: 600 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ textAlign: "center" }}>UUID</h3>
              <Form.Item
                name="uuid"
                rules={[{ required: true, message: "UUID를 입력해주세요" }]}
                style={{ width: "550px", height: "30px", fontSize: "20px" }}
              >
                <Input 
                  onChange={handleUuidChange} 
                  style={{ height: "40px", width: "100%", marginBottom: "10px" }} 
                  placeholder="UUID를 입력해주세요." 
                  size={"large"}
                />
              </Form.Item>

              <Form.Item style={{ width: "100%", textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleConfirm}
                  disabled={!uuid}
                  style={{ width: "400px", height: "45px", fontSize: "14px" }}
                >
                  확인
                </Button>
              </Form.Item>
            </div>
          </Card>
        </div>
      </main>

      {/* 로그인 성공 컴포넌트 */}
      <div>
        <h2>로그인 성공!</h2>
        {userInfo ? (
          <div>
            <p>{userInfo.id.toString()}, 안녕하세요 {userInfo.kakao_account.profile.nickname}님!</p>
          </div>
        ) : (
          <p>사용자 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
