import React, { useState } from "react";
import Socialkakao from "./Components/Socialkakao";

const Loginpage = () => {
    // UUID 상태 및 설정 함수
    const [uuid, setUuid] = useState('');

    // UUID 값을 변경하는 함수
    const handleUuidChange = (event) => {
        setUuid(event.target.value);
    };

    // 확인 버튼 클릭 시 이벤트 핸들러
    const handleSubmit = (event) => {
        event.preventDefault(); // 폼 제출 기본 동작 방지
        // eventschedule에서 UUID 값을 찾는다고 가정하고, 해당 UUID로 페이지 이동
        window.location.href = `http://localhost:8080/test/?key=${uuid}`;
    };

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'
        }}>
            <h1>로그인 페이지</h1>
            <Socialkakao /> {/* Socialkakao 컴포넌트 추가 */}
            {/* UUID 입력 폼 */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={uuid}
                    onChange={handleUuidChange}
                    placeholder="UUID를 입력하세요"
                />
                <button type="submit">확인</button>
            </form>
        </div>
    );
};

export default Loginpage;
