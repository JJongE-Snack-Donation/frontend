import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layouts/SidebarLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Home from './Pages/Home.js';
import Project from './Pages/Project.js';
import Camera from './Pages/Cam.js';
import ImageInquiry from './Pages/ImageInquiry.js';
import GeneralInspection from './Pages/GInspection.js';
import ExceptionInspection from './Pages/ExInspection.js';
import Login from './Pages/Login.js';
import './Assets/Font/Font.css';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            {/* 기본 레이아웃 (사이드바 포함) */}
            <Route element={<SidebarLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<Project />} />
              <Route path="/camera" element={<Camera />} />
              <Route path="/image-inquiry" element={<ImageInquiry />} />
              <Route path="/general-inspection" element={<GeneralInspection />} />
              <Route path="/exception-inspection" element={<ExceptionInspection />} />
            </Route>

            {/* 인증 레이아웃 (사이드바 미포함) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login/>} />
            </Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;