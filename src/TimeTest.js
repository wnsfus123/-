import React, { Fragment, useEffect, useState } from 'react';
import Select from 'react-select';

const TimeTest = () => {
  // 시간대 옵션들
  const timeOptions = [
    { value: 'morning', label: '아침' },
    { value: 'afternoon', label: '오후' },
    { value: 'evening', label: '저녁' }
  ];

  // 선택된 시간대 상태
  const [selectedTime, setSelectedTime] = useState(null);

  // 선택된 시간대 출력
  useEffect(() => {
    if (selectedTime) {
      console.log("선택된 시간대:", selectedTime.label);
    }
  }, [selectedTime]);

  return (
    <Fragment>
      <h2>시간대 선택</h2>
      <Select
        options={timeOptions}
        value={selectedTime}
        onChange={setSelectedTime}
        placeholder="시간대 선택"
      />
      {selectedTime && (
        <div>
          <h3>선택된 시간대:</h3>
          <p>{selectedTime.label}</p>
        </div>
      )}
    </Fragment>
  );
};

export default TimeTest;
