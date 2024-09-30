// Components/ExistingEvents.js
import React, { useState, useEffect } from "react";
import { Modal, List, Card, Button } from 'antd';
import axios from 'axios';

const ExistingEvents = ({ userInfo }) => {
  const [existingEvents, setExistingEvents] = useState([]);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        기존 일정 보기
      </Button>

      <Modal
        title="기존 일정"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={existingEvents}
          renderItem={item => (
            <List.Item>
              <Card title={item.eventname}>
                <p>시작: {item.startday}</p>
                <p>종료: {item.endday}</p>
                <Button type="primary" onClick={() => window.location.href = `http://localhost:8080/test/?key=${item.uuid}`}>
                  일정 바로가기
                </Button>
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ExistingEvents;
