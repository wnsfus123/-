import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"; // BrowserRouter를 사용하기 위해 수정
import CreateEvent from "./CreateEvent";
import EventPage from "./EventPage";
import TimeTest from "./TimeTest";
import AddLayout from "./Components/AddLayout";
import Redirection from "./Redirection";


const App = () => {
  return (
      <div className="app">
        <Router> {/* BrowserRouter로 변경 */}
          <Routes> 
            <Route path="/" element={<AddLayout />}>
              <Route path="/main" element={<CreateEvent />} />
              <Route path="/test" element={<EventPage />} />
              <Route path="/test/:uuid" element={<EventPage />} />
              <Route path="/time" element={<TimeTest />} />
              <Route path="/auth" element={<Redirection />} />
            </Route>
            <Route index={true} element={<Navigate replace to={"/main"}/>} />
          </Routes>
        </Router> {/* Router 태그 종료 */}
      </div>
  );
};

export default App;
