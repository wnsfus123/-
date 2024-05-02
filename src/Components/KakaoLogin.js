import React from "react";


const KakaoLogin = () => {
  const REST_API_KEY = "962e9e822d68cf5057ffc1e2eea6d3be";
  const REDIRECT_URI = "http://localhost:3000/auth";

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  const handleLogin = ()=>{
    window.location.href = kakaoURL
  }
  return (
    <div>
      <a href={kakaoURL}>
         <img src="/kakao_login_medium_narrow.png" alt="Kakao Login"></img>
      </a>
    </div>
  );
};

export default KakaoLogin;

