// App.js

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEvent from "./CreateEvent"; // EventPage.js 파일을 가져옵니다.
import EventPage from "./EventPage"; // EventPage.js 파일을 가져옵니다.
import TimeTest from "./TimeTest";


const App = () => {
  return (
      <div className="app">
        <Routes> 
          <Route path="/" element={<CreateEvent />} />
          <Route path="/test" element={<EventPage />} />
          <Route path="/test/:uuid" element={<EventPage />} />
          <Route path="/time" element={<TimeTest />} />
        </Routes>
      </div>
  );
};
export default App;
