// GetUserInfo 컴포넌트
import React, { useEffect } from 'react';
import axios from 'axios';

const GetUserInfo = ({ kakaoAccessToken, fnUserInfoCheck }) => {
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios({
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${kakaoAccessToken}` // 카카오 토큰 API로 얻은 access token 보내기
          },
          url: "https://kapi.kakao.com/v2/user/me",
        });
        
        // 사용자 정보를 콘솔에 출력
        const kakaoId = res.data.id.toString();
        const nickname = res.data.kakao_account.profile.nickname;
        console.log('사용자 정보:', res.data);
        
        // 서버로 사용자 정보 전송
        await axios.post('/api/save-user-info', { kakaoId, nickname });

        // sessionStorage/localStorage에 사용자 정보 저장
        fnUserInfoCheck(kakaoId, nickname); // 서비스 내 유저 조회를 위해 kakaoId, nickname 전달
      } catch (e) {
        console.log('e : ', e)
      }
    };

    if (kakaoAccessToken) {
      // 카카오 액세스 토큰이 있는 경우에만 사용자 정보 가져오기 시도
      fetchUserInfo();
    }
  }, [kakaoAccessToken, fnUserInfoCheck]);

  return null; // 렌더링할 내용이 없으므로 null 반환
};

export default GetUserInfo;
