import React, { useEffect, useState } from "react";
import Socialkakao from "./Components/Socialkakao";
import checkKakaoLoginStatus from "./Components/checkKakaoLoginStatus"; // 로그인 상태 확인 함수 가져오기

const Loginpage = () => {
    const [uuid, setUuid] = useState('');
    const [userInfo, setUserInfo] = useState(null); // LocalStorage를 직접 사용하여 상태 관리

    const handleUuidChange = (event) => {
        setUuid(event.target.value);
    };

    const handleLoginSuccess = (userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo)); // LocalStorage에 사용자 정보 저장
        setUserInfo(userInfo);
        window.location.href = `http://localhost:8080/test/?key=${uuid}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = `http://localhost:8080/test/?key=${uuid}`;
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const savedAccessToken = localStorage.getItem('kakaoAccessToken');
            if (savedAccessToken) {
                const status = await checkKakaoLoginStatus(savedAccessToken);
                if (status) {
                    // 로그인 상태 복원
                    const storedUserInfo = localStorage.getItem('userInfo');
                    if (storedUserInfo) {
                        setUserInfo(JSON.parse(storedUserInfo));
                    }
                } else {
                    // 카카오 로그아웃 시 상태 초기화
                    localStorage.removeItem('kakaoAccessToken');
                    localStorage.removeItem('userInfo');
                    setUserInfo(null);
                }
            }
        };

        checkLoginStatus();
    }, []); // 필요한 상태를 의존성 배열에 추가

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem('kakaoAccessToken'); // LocalStorage에서 액세스 토큰 제거
        localStorage.removeItem('userInfo'); // LocalStorage에서 사용자 정보 제거
        setUserInfo(null); // 상태 초기화
        window.location.href = '/'; // 홈 페이지로 리다이렉트
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
            {userInfo ? (
                <>
                    <p>{userInfo.id.toString()}, 안녕하세요 {userInfo.kakao_account.profile.nickname}님!</p>
                    <button onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <Socialkakao onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default Loginpage;
