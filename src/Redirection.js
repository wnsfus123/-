import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Redirection = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 카카오톡 로그인 후 받은 인증 코드를 사용하여 사용자 정보를 가져옴
        const response = await axios.get(`/api/save-user-info?code=${code}`);
        const userData = {
          userName: response.data.user_name // 가져온 사용자 이름만 서버로 전송
        };

        // 가져온 사용자 이름을 서버로 전송하여 MySQL 데이터베이스에 저장
        await axios.post("/api/save-user-info", userData);

        // 로그인 성공 후 로그인 성공 페이지로 이동
        navigate('/loginSuccess');
      } catch (error) {
        console.error("사용자 정보를 가져오거나 저장하는 중에 오류가 발생했습니다:", error);
      }
    };

    if (code) {
      // 페이지가 로드될 때 사용자 정보를 가져와서 서버로 전송
      fetchUserInfo();
    }
  }, [code, navigate]);

  return <div>로그인 중입니다.</div>;
};

export default Redirection;
