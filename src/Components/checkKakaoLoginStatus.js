import axios from 'axios';

const checkKakaoLoginStatus = async (accessToken) => {
  try {
    const response = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('카카오 로그인 상태 확인 중 오류 발생:', error);
    return null;
  }
};
export default checkKakaoLoginStatus;