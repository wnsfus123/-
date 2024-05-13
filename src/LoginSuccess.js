// LoginSuccess.js
import React from 'react';


const LoginSuccess = ({ nickname }) => {
  return (
    <div>
      {nickname && <p>Welcome {nickname}님!</p>}
    </div>
  );
};

export default LoginSuccess;
