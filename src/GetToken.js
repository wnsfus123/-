import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import GetUserInfo from './GetUserInfo'; // GetUserInfo를 가져옴


const GetToken = () => {
  const [accessToken, setAccessToken] = useState('');
  const CLIENT_ID = process.env.REACT_APP_KAKAO_REST_API_KEY; // 클라이언트 ID를 여기에 입력하세요
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI; // 리디렉션 URI를 여기에 입력하세요

  const navigate = useNavigate();

  const makeFormData = (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      searchParams.append(key, params[key]);
    });
    return searchParams;
  };

  useEffect(() => {
    const handleGetToken = async () => {
      // URL에서 code 가져오기
      const code = new URLSearchParams(window.location.search).get("code");

      // code가 있으면 토큰 요청
      if (code) {
        try {
          const res = await axios({
            method: 'POST',
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            url: 'https://kauth.kakao.com/oauth/token',
            data: makeFormData({
              grant_type: 'authorization_code',
              client_id: CLIENT_ID,
              redirect_uri: REDIRECT_URI,
              code // 인가 코드
            })
          });

          // 성공적으로 토큰을 받아왔을 때의 처리
          // 토큰을 상태에 저장하고 콘솔에 출력
          setAccessToken(res.data.access_token);
          console.log("Access Token:", res.data.access_token);

          // 로그인 성공 후 페이지 이동 , state 객체를 통해 엑세스 토큰 전달
          navigate('/create');
        } catch (err) {
          console.warn(err);
          // 에러 발생 시 처리
        }
      }
    };

    // 페이지가 처음 로드될 때 한 번만 실행
    handleGetToken();
  }, [CLIENT_ID, REDIRECT_URI]);

  const fnUserInfoCheck = (userId, nickname) => {
    console.log('사용자 ID:', userId);
    console.log('사용자 닉네임:', nickname);
    // 여기서 사용자 정보를 처리할 코드를 작성하세요
  };

  return (
    <div>
      <p>Access Token: {accessToken}</p>
      {/* GetUserInfo 컴포넌트를 포함하여 Kakao OAuth 토큰을 전달 */}
      <GetUserInfo kakaoAccessToken={accessToken} fnUserInfoCheck={fnUserInfoCheck} />
      <div>로그인 중입니다.</div>
    </div>
  );
};

export default GetToken;
