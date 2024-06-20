import React, { useEffect, useState } from "react";
import Socialkakao from "./Components/Socialkakao";
import useUserStore from './store/userStore';
import checkKakaoLoginStatus from "./Components/checkKakaoLoginStatus"; // 로그인 상태 확인 함수 가져오기

const Loginpage = () => {
    const [uuid, setUuid] = useState('');
    const userInfo = useUserStore(state => state.userInfo);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const clearUserInfo = useUserStore(state => state.clearUserInfo);

    const handleUuidChange = (event) => {
        setUuid(event.target.value);
    };

    const handleLoginSuccess = (userInfo) => {
        setUserInfo(userInfo);
        window.location.href = `http://localhost:8080/test/?key=${uuid}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = `http://localhost:8080/test/?key=${uuid}`;
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            if (userInfo && userInfo.accessToken) {
                const status = await checkKakaoLoginStatus(userInfo.accessToken);
                if (!status) {
                    clearUserInfo(); // 카카오 로그아웃 시 상태 초기화
                }
            }
        };

        checkLoginStatus();
    }, []); // 빈 배열을 두어 컴포넌트가 마운트될 때 한 번만 실행

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'
        }}>
            <h1>로그인 페이지</h1>
            <Socialkakao onLoginSuccess={handleLoginSuccess} />

        </div>
    );
};

export default Loginpage;
