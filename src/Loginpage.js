import React, { useEffect, useState } from "react";
import Socialkakao from "./Components/Socialkakao";
import checkKakaoLoginStatus from "./Components/checkKakaoLoginStatus"; // 로그인 상태 확인 함수 가져오기
import { Button, Layout, Typography, Space, Card } from 'antd';
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Loginpage = () => {
    const [userInfo, setUserInfo] = useState(null);

    // 로그인 성공 시 실행되는 함수
    const handleLoginSuccess = (userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo)); // LocalStorage에 저장
        sessionStorage.setItem('isLoggedIn', true); // SessionStorage에 로그인 상태 저장
        setUserInfo(userInfo);
        window.location.href = `http://localhost:8080/`;
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const savedAccessToken = localStorage.getItem('kakaoAccessToken');
            const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // SessionStorage에서 로그인 여부 확인
            
            if (savedAccessToken && isLoggedIn) {
                const status = await checkKakaoLoginStatus(savedAccessToken);
                if (status) {
                    const storedUserInfo = localStorage.getItem('userInfo');
                    if (storedUserInfo) {
                        setUserInfo(JSON.parse(storedUserInfo));
                    }
                } else {
                    localStorage.removeItem('kakaoAccessToken');
                    localStorage.removeItem('userInfo');
                    sessionStorage.removeItem('isLoggedIn');
                    setUserInfo(null);
                }
            } else {
                // 세션이 없으면 로그인 상태 해제
                setUserInfo(null);
            }
        };

        checkLoginStatus();
    }, []);

    // 창을 닫을 때 로그아웃 처리
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!event.persisted) { // 창이 캐싱되지 않은 경우에만(새로고침, 링크 방지)
                localStorage.removeItem('kakaoAccessToken');
                localStorage.removeItem('userInfo');
                sessionStorage.removeItem('isLoggedIn'); // 세션에서 로그인 상태 제거
                setUserInfo(null);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem('kakaoAccessToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('isLoggedIn'); // 세션에서 로그인 상태 제거
        setUserInfo(null);
        window.location.href = '/';
    };

    const handleCreateEvent = () => {
        window.location.href = 'http://localhost:8080/create';
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ textAlign: 'center', background: '#001529' }}>
                <Title style={{ color: 'white', margin: 0 }}>로그인 페이지</Title>
            </Header>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '50px' }}>
                <Card style={{ width: 400, textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    {userInfo ? (
                        <Space direction="vertical" align="center">
                            <Text> 안녕하세요 {userInfo.kakao_account.profile.nickname}님!</Text>
                            <Button type="primary" onClick={handleCreateEvent}>이벤트 생성창 바로가기</Button>
                            <Button type="primary" onClick={handleLogout}>로그아웃</Button>
                        </Space>
                    ) : (
                        <Space direction="vertical" align="center">
                            <Socialkakao onLoginSuccess={handleLoginSuccess} />
                        </Space>
                    )}
                </Card>
            </Content>
        </Layout>
    );
};

export default Loginpage;
