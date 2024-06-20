// src/components/GetUserInfo.js
import React, { useEffect } from 'react';
import axios from 'axios';
import useUserStore from './store/userStore'; // Zustand 스토어 가져오기

const GetUserInfo = ({ kakaoAccessToken, fnUserInfoCheck }) => {
  const setUserInfo = useUserStore(state => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: {
            "Authorization": `Bearer ${kakaoAccessToken}`,
          },
        });

        const kakaoId = res.data.id.toString();
        const nickname = res.data.kakao_account.profile.nickname;

        await axios.post('/api/save-user-info', { kakaoId, nickname });

        fnUserInfoCheck(kakaoId, nickname);

        // Zustand 스토어에 사용자 정보 저장
        setUserInfo(res.data);
      } catch (e) {
        console.log('e : ', e);
      }
    };

    if (kakaoAccessToken) {
      fetchUserInfo();
    }
  }, [kakaoAccessToken, fnUserInfoCheck, setUserInfo]);

  return null;
};

export default GetUserInfo;
