import React, { useState, useEffect } from "react";
import { Modal, List, Card, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const ExistingEvents = ({ userInfo }) => {
  const [existingEvents, setExistingEvents] = useState([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false); // 삭제 버튼 상태 추가

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
        const { eventDetails, participants, creator } = response.data;
        setSelectedEventDetails({
          ...eventDetails,
          participants: participants.length > 0 ? participants : [],
          creator: creator ? creator : { nickname: "알 수 없음" },
        });
      })
      .catch(error => {
        console.error("Error fetching event details:", error);
        setIsModalVisible(false);
      });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEventDetails(null);
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format('YYYY년 MM월 DD일 HH시');
  };

  const confirmDeleteEvent = (uuid) => {
    setEventToDelete(uuid);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteEvent = () => {
    axios.delete('/api/delete-event', {
      data: { 
        event_uuid: eventToDelete,
        kakaoId: userInfo.id.toString() // 현재 Kakao ID 전송
      }
    })
    .then(response => {
      message.success("일정이 성공적으로 삭제되었습니다.");
      setExistingEvents(existingEvents.filter(event => event.uuid !== eventToDelete));
      setDeleteConfirmationVisible(false);
      setEventToDelete(null);
    })
    .catch(error => {
      console.error("일정 삭제 중 오류 발생:", error);
      message.error("일정 삭제 중 오류가 발생했습니다.");
    });
  };
  

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(!showDeleteButtons); // 삭제 버튼 표시 상태 전환
  };

  return (
    <div>
      <h2>나의 일정</h2>
      <Button onClick={toggleDeleteButtons} style={{ marginBottom: 16 }}>
        {showDeleteButtons ? "삭제 취소" : "일정 삭제"}
      </Button>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={existingEvents}
        renderItem={event => (
          <List.Item>
            <Card title={event.eventname} extra={showDeleteButtons ? (
              <Button 
                type="text" 
                onClick={() => confirmDeleteEvent(event.uuid)} 
                style={{ color: 'red' }}
              >
                X
              </Button>
            ) : null}>
              <p>{formatDateTime(event.startday)} ~ {formatDateTime(event.endday)}</p>
              <Button onClick={() => showEventDetails(event.uuid)}>상세보기</Button>
              <Button 
                type="primary" 
                style={{ marginLeft: 10 }} 
                href={`http://localhost:8080/test/?key=${event.uuid}`} 
                target="_blank"
              >
                일정 바로가기
              </Button>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="일정 삭제 확인"
        visible={deleteConfirmationVisible}
        onOk={handleDeleteEvent}
        onCancel={() => setDeleteConfirmationVisible(false)}
        okText="확인"
        cancelText="취소"
      >
        <p>정말로 삭제하시겠습니까?</p>
      </Modal>

      <Modal title="일정 세부정보" visible={isModalVisible} onOk={closeModal} onCancel={closeModal} okText="확인" cancelText="취소">
        {selectedEventDetails ? (
          <div>
            <p><strong>생성자:</strong> {selectedEventDetails.creator.nickname}</p>
            <p><strong>일정 이름:</strong> {selectedEventDetails.eventname}</p>
            <p><strong>시작일:</strong> {formatDateTime(selectedEventDetails.startday)}</p>
            <p><strong>종료일:</strong> {formatDateTime(selectedEventDetails.endday)}</p>
            <p><strong>참여자:</strong></p>
            <ul>
              {selectedEventDetails.participants.length > 0 ? (
                selectedEventDetails.participants.map((participant, index) => (
                  <li key={index}>
                    {participant.nickname} - {moment(participant.event_datetime).format('YYYY년 MM월 DD일 HH시')}
                  </li>
                ))
              ) : (
                <li>참여자가 없습니다.</li>
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
