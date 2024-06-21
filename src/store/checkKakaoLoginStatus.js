import axios from 'axios';

const checkKakaoLoginStatus = async (accessToken) => {
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error checking Kakao login status:', error);
    return false;
  }
};

export default checkKakaoLoginStatus;
