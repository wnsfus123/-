import React, { useState, useEffect } from "react";
import { Modal, List, Card, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';

const ExistingEvents = ({ userInfo }) => {
  const [existingEvents, setExistingEvents] = useState([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (userInfo) {
      fetchExistingEvents(userInfo.id.toString());
    }
  }, [userInfo]);

  const fetchExistingEvents = (kakaoId) => {
    axios.get(`/api/events/user/${kakaoId}`)
      .then(response => {
        setExistingEvents(response.data);
      })
      .catch(error => {
        console.error("Error fetching existing events:", error);
      });
  };

  const showEventDetails = (uuid) => {
    setIsModalVisible(true);
    axios.get(`/api/event-schedules/details/${uuid}`)
      .then(response => {
        console.log("상세 이벤트 정보:", response.data); // Log the entire response
        const { eventDetails, participants, creator } = response.data;

        // Check if creator exists
        if (!creator) {
          console.error("Creator 정보가 없습니다.");
        }

        setSelectedEventDetails({
          ...eventDetails,
          participants,
          creator: creator || { nickname: "알 수 없음" }, // 대체 값 추가
        });
      })
      .catch(error => {
        console.error("Error fetching event details:", error);
        setIsModalVisible(false); // 오류 발생 시 모달 닫기
      });
};


  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEventDetails(null);
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format('YYYY년 MM월 DD일 HH시');
  };

  return (
    <div>
      <h2>Existing Events</h2>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={existingEvents}
        renderItem={event => (
          <List.Item>
            <Card title={event.eventname}>
              <p>{formatDateTime(event.startday)} ~ {formatDateTime(event.endday)}</p>
              <Button onClick={() => showEventDetails(event.uuid)}>상세보기</Button>
              <Button 
                type="primary" 
                style={{ marginLeft: 10 }} 
                href={`http://localhost:8080/test/?key=${event.uuid}`} 
                target="_blank"
              >
                이벤트 바로가기
              </Button>
            </Card>
          </List.Item>
        )}
      />
     <Modal title="Event Details" visible={isModalVisible} onOk={closeModal} onCancel={closeModal}>
    {selectedEventDetails ? (
        <div>
            <p><strong>생성자:</strong> {selectedEventDetails.creator.nickname}</p>
            <p><strong>이벤트 이름:</strong> {selectedEventDetails.eventname}</p>
            <p><strong>시작일:</strong> {formatDateTime(selectedEventDetails.startday)}</p>
            <p><strong>종료일:</strong> {formatDateTime(selectedEventDetails.endday)}</p>
            <p><strong>참여자:</strong></p>
            <ul>
                {selectedEventDetails.participants.length > 0 ? (
                    selectedEventDetails.participants.map((participant, index) => (
                        <li key={index}>
                            {participant.nickname} - {moment(participant.event_datetime).format('YYYY년 MM월 DD일 HH시')} // 참여자 이름과 참여 시간 표시
                        </li>
                    ))
                ) : (
                    <li>참여자가 없습니다.</li> // 참여자가 없을 경우 메시지 표시
                )}
            </ul>
        </div>
    ) : (
        <p>이벤트 세부 정보를 불러오는 중입니다...</p>
    )}
</Modal>


    </div>
  );
};

export default ExistingEvents;


