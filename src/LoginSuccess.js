import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const LoginSuccess = () => {
  const location = useLocation();
  const { kakaoAccessToken } = location.state || {};
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!kakaoAccessToken) return;

      try {
        const res = await axios({
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${kakaoAccessToken}`
          },
          url: "https://kapi.kakao.com/v2/user/me",
        });

        setUserInfo(res.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [kakaoAccessToken]);

  return (
    <div>
      <h2>로그인 성공!</h2>
      {userInfo ? (
        <div>
          <p>안녕하세요 {userInfo.kakao_account.profile.nickname}님!</p>
        </div>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default LoginSuccess;
