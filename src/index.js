import React from 'react';
import ReactDOM from 'react-dom'; // ReactDOM을 한 번만 선언합니다.
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React 18 이후 버전에서는 createRoot를 사용합니다.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <App />
 </React.StrictMode>
);

// ReactDOM.render() 메서드는 제거합니다.

// 웹 성능 측정을 위해 reportWebVitals 함수를 사용합니다.
reportWebVitals();
