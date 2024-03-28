import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App'; // 메인 컴포넌트를 임포트합니다.

const root = createRoot(document.getElementById('root')); // 'root' ID를 가진 DOM 요소를 선택합니다.
root.render(<App />); // 메인 컴포넌트를 렌더링합니다.

// ReactDOM.render() 메서드는 제거합니다.

// 웹 성능 측정을 위해 reportWebVitals 함수를 사용합니다.
<<<<<<< Updated upstream
reportWebVitals();

// 지금 상태 npm start 로는 정상작동 나중에 node 연결해서 db 어쩌구 해야할꺼같아서 설치하고
// node Server.js 하면 좆창남
=======
>>>>>>> Stashed changes

